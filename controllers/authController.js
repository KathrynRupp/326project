import * as authService from "../services/authService.js";

const wantsHtml = (req) => req.accepts(["json", "html"]) === "html";

const fail = (req, res, view, { status, message }) => {
  if (wantsHtml(req)) return res.status(status).render(view, { error: message });
  return res.status(status).json({ error: message });
};

// makes a new session for every login
const startSession = (req, user) =>
  new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      req.session.user = user;
      resolve();
    });
  });

export const showSignup = (req, res) => res.render("signup", { error: null });
export const showLogin = (req, res) => res.render("login", { error: null });

export async function signup(req, res) {
  const result = await authService.signup(req.body);
  if (!result.ok) return fail(req, res, "signup", result.error);
  await startSession(req, result.value);
  if (wantsHtml(req)) return res.redirect("/");
  res.status(201).json(result.value);
}

export async function login(req, res) {
  const result = await authService.login(req.body);
  if (!result.ok) return fail(req, res, "login", result.error);
  await startSession(req, result.value);
  if (wantsHtml(req)) return res.redirect("/");
  res.status(200).json(result.value);
}

export function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    if (wantsHtml(req)) return res.redirect("/");
    res.status(200).json({ loggedOut: true });
  });
}

export function me(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.json(req.session.user);
}
