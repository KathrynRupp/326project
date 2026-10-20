
import { Router } from "express";
import * as controller from "../controllers/requestsController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));
router.get("/:id", asyncHandler(controller.getOne));

export default router;
