import { describe, expect, it } from "bun:test";
import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { authMiddleware } from "../auth.middleware";
import { requireRole } from "../rbac.middleware";
import type { AuthenticatedRequest } from "../tenant.middleware";

function createMockResponse() {
  const res: Partial<Response> = {
    statusCode: 200,
    status(code: number) {
      this.statusCode = code;
      return this as Response;
    },
    json(data: unknown) {
      (this as Record<string, unknown>)._data = data;
      return this as Response;
    },
  };
  return res as Response & { statusCode: number; _data: unknown };
}

describe("Auth & RBAC Middleware Unit Tests", () => {
  const validOwnerToken = jwt.sign(
    { userId: "usr-owner", tenantId: "tenant-1", role: "owner" },
    env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  const validCashierToken = jwt.sign(
    { userId: "usr-cashier", tenantId: "tenant-1", role: "cashier" },
    env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  const validSuperAdminToken = jwt.sign(
    { userId: "usr-superadmin", tenantId: "tenant-1", role: "superadmin" },
    env.JWT_SECRET,
    { expiresIn: "1h" },
  );

  describe("authMiddleware", () => {
    it("should reject request without Authorization header (401)", () => {
      const req: Partial<AuthenticatedRequest> = { headers: {} };
      const res = createMockResponse();
      let nextCalled = false;

      authMiddleware(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(res.statusCode).toBe(401);
      expect((res._data as { message: string }).message).toContain(
        "Token tidak ditemukan",
      );
    });

    it("should reject request with invalid Bearer token (401)", () => {
      const req: Partial<AuthenticatedRequest> = {
        headers: { authorization: "Bearer invalid.fake.token" },
      };
      const res = createMockResponse();
      let nextCalled = false;

      authMiddleware(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(res.statusCode).toBe(401);
      expect((res._data as { message: string }).message).toContain(
        "Token tidak valid",
      );
    });

    it("should accept valid token and populate req.userId and req.userRole", () => {
      const req: Partial<AuthenticatedRequest> = {
        headers: { authorization: `Bearer ${validOwnerToken}` },
      };
      const res = createMockResponse();
      let nextCalled = false;

      authMiddleware(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
      expect(req.userId).toBe("usr-owner");
      expect(req.userRole).toBe("owner");
      expect(req.tenantId).toBe("tenant-1");
    });
  });

  describe("requireRole Middleware", () => {
    it("should block request if req.userRole is missing (403)", () => {
      const req: Partial<AuthenticatedRequest> = {};
      const res = createMockResponse();
      let nextCalled = false;

      const guard = requireRole("owner");
      guard(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(res.statusCode).toBe(403);
    });

    it("should allow matching role (e.g. owner for owner route)", () => {
      const req: Partial<AuthenticatedRequest> = { userRole: "owner" };
      const res = createMockResponse();
      let nextCalled = false;

      const guard = requireRole("owner");
      guard(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });

    it("should allow multi-role matching (e.g. cashier or owner)", () => {
      const req: Partial<AuthenticatedRequest> = { userRole: "cashier" };
      const res = createMockResponse();
      let nextCalled = false;

      const guard = requireRole("cashier", "owner");
      guard(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });

    it("should deny cashier from accessing owner-only route (403)", () => {
      const req: Partial<AuthenticatedRequest> = { userRole: "cashier" };
      const res = createMockResponse();
      let nextCalled = false;

      const guard = requireRole("owner");
      guard(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(res.statusCode).toBe(403);
      expect((res._data as { message: string }).message).toContain(
        "Akses ditolak",
      );
    });

    it("should deny owner from accessing superadmin-only route (403)", () => {
      const req: Partial<AuthenticatedRequest> = { userRole: "owner" };
      const res = createMockResponse();
      let nextCalled = false;

      const guard = requireRole("superadmin");
      guard(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(false);
      expect(res.statusCode).toBe(403);
      expect((res._data as { message: string }).message).toContain(
        "Akses ditolak",
      );
    });

    it("should always allow superadmin universal access (bypass privilege)", () => {
      const req: Partial<AuthenticatedRequest> = { userRole: "superadmin" };
      const res = createMockResponse();
      let nextCalled = false;

      const guard = requireRole("owner");
      guard(req as AuthenticatedRequest, res, () => {
        nextCalled = true;
      });

      expect(nextCalled).toBe(true);
    });
  });
});
