//import dependencies
import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import pagesRouter from "./routes/pages.js";
import listingsRouter from "./routes/listings.js";
import requestsRouter from "./routes/requests.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRouter from "./routes/auth.js";

//initialize app object and set port
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin";

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production" ? "" : "dev-only-secret-change-me");
if (!SESSION_SECRET) throw new Error("SESSION_SECRET needs to be set in production");

//connect to database
await mongoose.connect(MONGODB_URI);

//ejs setup
app.set("view engine", "ejs");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 60 * 24 * 7 },
  }),
);

//auth (see who's logged in as "user")
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

//routes
app.use("/", pagesRouter);
app.use("/listings", listingsRouter);
app.use("/requests", requestsRouter);
app.use("/", authRouter);

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
