import bcrypt from "bcrypt";
import { Ok, Err } from "../result.js";
import * as usersRepository from "../repositories/usersRepository.js";
import { toUserDto } from "../dtos/userDto.js";

// maybe change length later??
const MIN_PASSWORD_LENGTH = 8;

export const signup = async ({ name, email, password } = {}) => {
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!trimmedName || !trimmedEmail || typeof password !== "string" || !password) {
    return Err({ status: 400, message: "Name, email and password required" });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return Err({ status: 400, message: "Your password must be at least 8 characters" });
  }

  const existing = await usersRepository.findByEmail(trimmedEmail);
  if (existing) return Err({ status: 409, message: "This email is already registered" });

  // new account creating
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await usersRepository.create({
    name: trimmedName,
    email: trimmedEmail,
    passwordHash,
    role: "member",
  });
  return Ok(toUserDto(user));
};

export const login = async ({ email, password } = {}) => {
  const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const user = trimmedEmail ? await usersRepository.findByEmail(trimmedEmail) : null;
  const badLogin = Err({ status: 401, message: "Wrong email or password" });

  if (!user || typeof password !== "string") return badLogin;
  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return badLogin;

  return Ok(toUserDto(user));
};
