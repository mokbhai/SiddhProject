const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error_msg", "Please log in to access this resource");
  res.redirect("/auth/login");
};

const ensureRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash(
        "error_msg",
        "You do not have permission to access this resource"
      );
      return res.redirect("/dashboard");
    }
    next();
  };
};

module.exports = { ensureAuthenticated, ensureRole };
