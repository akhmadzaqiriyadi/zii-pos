import { db } from "@zii/db";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export interface RegisterTenantInput {
  tenantName: string;
  subdomain?: string;
  planId?: string;
  phone?: string;
  address?: string;
  ownerName: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {
  static async registerTenant(input: RegisterTenantInput) {
    const existingUser = await db.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
    });

    if (existingUser) {
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }

    const cleanSubdomain = input.subdomain
      ? input.subdomain
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 30)
      : input.tenantName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 30) || `tenant${Date.now().toString().slice(-6)}`;

    // Check subdomain uniqueness
    const existingTenant = await db.tenant.findUnique({
      where: { subdomain: cleanSubdomain },
    });

    if (existingTenant) {
      throw new Error(
        `Subdomain '${cleanSubdomain}' sudah dipakai oleh toko lain. Silakan pilih subdomain lain.`,
      );
    }

    const passwordHash = await Bun.password.hash(input.password);

    // Find requested Plan or fallback to active starter plan
    let plan = input.planId
      ? await db.plan.findUnique({ where: { id: input.planId } })
      : null;

    if (!plan) {
      plan = await db.plan.findFirst({
        where: { isActive: true },
        orderBy: { price: "asc" },
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14); // 14-day default trial period

    const result = await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: input.tenantName,
          subdomain: cleanSubdomain,
          phone: input.phone,
          address: input.address,
          status: "trial",
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: input.ownerName,
          email: input.email.toLowerCase().trim(),
          passwordHash,
          role: "owner",
        },
      });

      if (plan) {
        await tx.subscription.create({
          data: {
            tenantId: tenant.id,
            planId: plan.id,
            status: "trial",
            startsAt: new Date(),
            expiresAt,
            autoRenew: true,
          },
        });
      }

      return { tenant, user };
    });

    const token = jwt.sign(
      {
        userId: result.user.id,
        tenantId: result.tenant.id,
        role: result.user.role,
      },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      token,
      tenant: result.tenant,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    };
  }

  static async login(input: LoginInput) {
    const user = await db.user.findUnique({
      where: { email: input.email.toLowerCase().trim() },
      include: { tenant: true },
    });

    if (user) {
      const isValidPassword = await Bun.password.verify(
        input.password,
        user.passwordHash,
      );
      if (isValidPassword) {
        const token = jwt.sign(
          {
            userId: user.id,
            tenantId: user.tenantId,
            role: user.role,
          },
          env.JWT_SECRET,
          { expiresIn: "7d" },
        );

        return {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          tenant: user.tenant,
        };
      }
    }

    throw new Error("Email atau password tidak valid.");
  }
}
