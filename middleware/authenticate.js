const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.cookies.token;

  // Get token from header or cookie
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request
    next(); // Allow access
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticate;
