// src/middleware/requireAdmin.js
// Simple middleware that expects previous auth middleware to set req.user
export default function requireAdmin(req, res, next) {
  try {
    // auth middleware should set req.user (with role)
    const user = req.user || (req?.headers?.authorization ? null : null);
    if (!user) {
      return res.status(401).json({ success:false, message:'Not authenticated' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ success:false, message:'Admin required' });
    }
    return next();
  } catch (e) {
    return res.status(500).json({ success:false, message:'Server error' });
  }
}
