import jwt from 'jsonwebtoken';

export function signJwt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || '7d'
  });
}

export function authRequired(req, res, next) {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null);

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
