import { Router } from "express";
import * as listingsController from "../controllers/listingsController.js";
import { asyncHandler } from "../asyncHandler.js";
import { requireLogin } from "../middleware/requireLogin.js";

const router = Router();

router.get("/", asyncHandler(listingsController.index));
router.post("/", requireLogin, asyncHandler(listingsController.create));
router.put("/:id", requireLogin, asyncHandler(listingsController.update));
router.delete("/:id", requireLogin, asyncHandler(listingsController.destroy));

export default router;
