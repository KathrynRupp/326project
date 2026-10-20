import { Router } from "express";
import * as listingsController from "../controllers/listingsController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listingsController.index));
router.post("/", asyncHandler(listingsController.create));
router.put("/:id", asyncHandler(listingsController.update));
router.delete("/:id", asyncHandler(listingsController.destroy));

export default router;
