import JWT from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  const authorization = req.headers.authorization;
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;
  const token = bearerToken || req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userID };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
};