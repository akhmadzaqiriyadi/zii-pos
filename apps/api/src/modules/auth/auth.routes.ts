import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.get("/check-subdomain", AuthController.checkSubdomain);
router.post("/register-tenant", AuthController.registerTenant);
router.post("/login", AuthController.login);

export const authRouter = router;
