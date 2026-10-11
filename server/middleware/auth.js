const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Checks the token sent in the header: Authorization: Bearer <token>
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load the user from the database, but never include the password
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    // Wrong, expired or tampered token
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Lets the request through only if the logged-in user is a manager
const managerOnly = (req, res, next) => {
  if (req.user && req.user.role === "manager") {
    return next();
  }
  return res.status(403).json({ message: "Access denied, managers only" });
};

module.exports = { protect, managerOnly };