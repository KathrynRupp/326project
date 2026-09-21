import express from "express";
import pagesRouter from "./routes/pages.js";
import listingsRouter from "./routes/listings.js";

const app = express();
const PORT = process.env.port || 3000;

//routes
app.use("/", pagesRouter);
app.use("/listings", listingsRouter);

//page not found
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
