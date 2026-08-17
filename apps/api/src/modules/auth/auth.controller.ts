import type { Request, Response } from "express";
import { ApiResponse } from "../../utils/api-response";
import { AuthService } from "./auth.service";

export class AuthController {
  static async checkSubdomain(req: Request, res: Response) {
    try {
      const subdomain = req.query.subdomain as string;
      const result = await AuthService.checkSubdomainAvailability(subdomain);
      return ApiResponse.success(res, result.message, result);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal memeriksa ketersediaan subdomain.";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async registerTenant(req: Request, res: Response) {
    try {
      const {
        tenantName,
        subdomain,
        planId,
        ownerName,
        email,
        password,
        phone,
        address,
      } = req.body;

      if (!tenantName || !ownerName || !email || !password) {
        return ApiResponse.error(
          res,
          "Kolom tenantName, ownerName, email, dan password wajib diisi.",
          null,
          400,
        );
      }

      const result = await AuthService.registerTenant({
        tenantName,
        subdomain,
        planId,
        ownerName,
        email,
        password,
        phone,
        address,
      });

      return ApiResponse.success(
        res,
        "Pendaftaran Merchant ZII POS berhasil!",
        result,
        201,
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Gagal mendaftarkan merchant.";
      return ApiResponse.error(res, message, error, 400);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ApiResponse.error(
          res,
          "Email dan password wajib diisi.",
          null,
          400,
        );
      }

      const result = await AuthService.login({ email, password });
      return ApiResponse.success(res, "Login berhasil!", result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Login gagal.";
      return ApiResponse.error(res, message, error, 401);
    }
  }
}
