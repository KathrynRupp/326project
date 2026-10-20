import express from "express";
import pagesRouter from "./routes/pages.js";
import listingsRouter from "./routes/listings.js";
import requestsRouter from "./routes/requests.js";
import mongoose from "mongoose";


const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");

await mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin'
);

//routes
app.use("/", pagesRouter);
app.use("/listings", listingsRouter);
app.use("/requests", requestsRouter);

//page not found
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
