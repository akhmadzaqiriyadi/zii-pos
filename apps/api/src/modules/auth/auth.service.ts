import { db } from "@zii/db";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export interface RegisterTenantInput {
  tenantName: string;
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
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error("Email sudah terdaftar. Silakan gunakan email lain.");
    }

    const passwordHash = await Bun.password.hash(input.password);

    const baseSubdomain =
      input.tenantName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .slice(0, 30) || `tenant${Date.now().toString().slice(-6)}`;

    const result = await db.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: input.tenantName,
          subdomain: baseSubdomain,
          phone: input.phone,
          address: input.address,
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: input.ownerName,
          email: input.email,
          passwordHash,
          role: "owner",
        },
      });

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
      where: { email: input.email },
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
          tenant: user.tenant,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }
    }

    throw new Error("Email atau password tidak valid.");
  }
}
