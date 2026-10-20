import { Router } from "express";
import { join } from "path";

const router = Router();

router.get("/", (req, res) => {
  res.render("home");
});

export default router;
