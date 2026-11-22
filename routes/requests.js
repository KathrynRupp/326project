import { Router } from "express";
import * as controller from "../controllers/requestsController.js";
import { asyncHandler } from "../asyncHandler.js";
import { requireLogin } from "../middleware/requireLogin.js";

const router = Router();

router.get("/", requireLogin, asyncHandler(controller.list));
router.post("/", requireLogin, asyncHandler(controller.create));
router.get("/:id", requireLogin, asyncHandler(controller.getOne));
router.put("/:id", requireLogin, asyncHandler(controller.update));
router.delete("/:id", requireLogin, asyncHandler(controller.destroy));

export default router;
