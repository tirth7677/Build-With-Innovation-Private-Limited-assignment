const userroleverify = (req, res, next) => {
  if (req.user.role === "User") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. This route is for users only.",
    });
  }
};

const adminroleverify = (req, res,next) => {
  if (req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. This route is for admins only.",
    });
  }
};

module.exports = { userroleverify, adminroleverify };