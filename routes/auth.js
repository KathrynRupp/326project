import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/signup", authController.showSignup);
router.post("/signup", asyncHandler(authController.signup));
router.get("/login", authController.showLogin);
router.post("/login", asyncHandler(authController.login));
router.post("/logout", authController.logout);
router.get("/me", authController.me);

export default router;
