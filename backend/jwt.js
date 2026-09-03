const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || 'agritech_jwt_secret_key_2026';

const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing or malformed. Use format: Bearer <token>"
    });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired JWT token"
    });
  }
};

const optionalAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch {
      // benign for optional auth
    }
  }
  next();
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: this action requires one of [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
    }

    next();
  };
};

const generateToken = (userData) => {
  const payload = {
    id: userData.id || userData._id,
    email: userData.email,
    name: userData.name,
    role: userData.role || 'FARM_OWNER',
    roleTitle: userData.roleTitle
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = {
  jwtAuthMiddleware,
  optionalAuthMiddleware,
  requireRole,
  generateToken,
  JWT_SECRET
};