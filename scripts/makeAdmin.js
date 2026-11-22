import "dotenv/config";
import mongoose from "mongoose";
import * as usersRepository from "../repositories/usersRepository.js";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin";

const email = (process.argv[2] || "").trim().toLowerCase();
if (!email) {
  console.error("Usage: npm run make-admin -- someone@example.com");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
const user = await usersRepository.updateRoleByEmail(email, "admin");
console.log(
  user ? '${user.email} is now an admin.' : 'No user found with email ${email}. Sign up first.',
);
await mongoose.disconnect();
