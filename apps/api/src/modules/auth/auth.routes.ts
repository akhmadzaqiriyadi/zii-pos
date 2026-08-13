import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register-tenant", AuthController.registerTenant);
router.post("/login", AuthController.login);

export const authRouter = router;
