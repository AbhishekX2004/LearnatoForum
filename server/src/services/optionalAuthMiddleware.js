import jwt from 'jsonwebtoken';

export const optionalAuthenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  req.user = null; // Default to no user

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add payload if token is valid
    } catch (err) {
      // Invalid token, just ignore it and proceed
    }
  }
  next();
};