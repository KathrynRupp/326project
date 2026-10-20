//import dependencies
import express from "express";
import pagesRouter from "./routes/pages.js";
import listingsRouter from "./routes/listings.js";
import requestsRouter from "./routes/requests.js";
import mongoose from "mongoose";

//initialize app object and set port
const app = express();
const PORT = process.env.PORT || 3000;

//connect to database
await mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
);

//ejs setup
app.set("view engine", "ejs");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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

//start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
