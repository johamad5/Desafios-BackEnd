export function authRequired(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("pages/login.ejs", {});
  }
}
