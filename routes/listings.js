import { Router } from "express";

const router = Router();

app.get("/listings", (req, res) => {
  // rename to fit your project
  res.send("<h1>Item List</h1>");
});

export default router;
