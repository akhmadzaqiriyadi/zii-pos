import { describe, expect, it } from "bun:test";
import type { Response } from "express";
import { requirePermission } from "../permission.middleware";
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

describe("requirePermission Middleware Unit Tests", () => {
  it("should allow superadmin universal bypass (*)", async () => {
    const req: Partial<AuthenticatedRequest> = {
      userId: "usr-admin",
      userRole: "superadmin",
      tenantId: "tenant-1",
    };
    const res = createMockResponse();
    let nextCalled = false;

    const guard = requirePermission("any:restricted_permission");
    await guard(req as AuthenticatedRequest, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it("should allow owner to access products:create", async () => {
    const req: Partial<AuthenticatedRequest> = {
      userId: "usr-owner",
      userRole: "owner",
      tenantId: "tenant-1",
    };
    const res = createMockResponse();
    let nextCalled = false;

    const guard = requirePermission("products:create");
    await guard(req as AuthenticatedRequest, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it("should allow cashier to access pos:access", async () => {
    const req: Partial<AuthenticatedRequest> = {
      userId: "usr-cashier",
      userRole: "cashier",
      tenantId: "tenant-1",
    };
    const res = createMockResponse();
    let nextCalled = false;

    const guard = requirePermission("pos:access");
    await guard(req as AuthenticatedRequest, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it("should deny cashier from accessing products:delete (403)", async () => {
    const req: Partial<AuthenticatedRequest> = {
      userId: "usr-cashier",
      userRole: "cashier",
      tenantId: "tenant-1",
    };
    const res = createMockResponse();
    let nextCalled = false;

    const guard = requirePermission("products:delete");
    await guard(req as AuthenticatedRequest, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(res.statusCode).toBe(403);
    expect((res._data as { message: string }).message).toContain(
      "Akses ditolak",
    );
  });

  it("should deny unauthenticated request (403)", async () => {
    const req: Partial<AuthenticatedRequest> = {};
    const res = createMockResponse();
    let nextCalled = false;

    const guard = requirePermission("pos:access");
    await guard(req as AuthenticatedRequest, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(res.statusCode).toBe(403);
  });
});
