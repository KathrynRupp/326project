const message = "You must be logged in to do that.";

export const requireLogin = (req, res, next) => {
  if (!req.user) {
    if (req.get("HX-Request") === "true") {
      res.status(401).send(message);
      return;
    }
    res.status(401).json({ error: message });
    return;
  }
  next();
};
