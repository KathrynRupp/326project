import { Router } from "express";
import { join } from "path";

const router = Router();

app.get("/", (req, res) => {
  res.send("<h1>Home</h1>");
});

export default router;
