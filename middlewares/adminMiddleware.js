const adminMiddleware = (req, res, next) => {
  // authMiddleware should run before this
  if (!req.user) {
    return res.status(401).json({ msg: 'Authentication required' });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  
  next();
};

module.exports = adminMiddleware;