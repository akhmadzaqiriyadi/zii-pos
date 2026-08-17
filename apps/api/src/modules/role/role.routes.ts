import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/permission.middleware";
import { tenantMiddleware } from "../../middlewares/tenant.middleware";
import { RoleController } from "./role.controller";

const router = Router();

// Public Catalog of System Permissions
router.get("/permissions-catalog", RoleController.getPermissionsCatalog);

// 🔒 Protected Role Management Endpoints (Requires Tenant & Roles Permission)
router.use(tenantMiddleware);
router.use(authMiddleware);

router.get(
  "/",
  requirePermission("roles:manage", "cashiers:manage"),
  RoleController.getRoles,
);

router.get(
  "/:id",
  requirePermission("roles:manage"),
  RoleController.getRoleById,
);

router.post("/", requirePermission("roles:manage"), RoleController.createRole);

router.put(
  "/:id",
  requirePermission("roles:manage"),
  RoleController.updateRole,
);

router.delete(
  "/:id",
  requirePermission("roles:manage"),
  RoleController.deleteRole,
);

export const roleRouter = router;
