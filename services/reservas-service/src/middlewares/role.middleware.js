function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'unauthenticated',
        message: 'Authentication is required',
      });
    }

    const roles = Array.isArray(req.user.roles) ? req.user.roles : [];

    if (allowedRoles.includes(req.user.role) || roles.some((role) => allowedRoles.includes(role))) {
      return next();
    }

    return res.status(403).json({
      error: 'forbidden',
      message: 'You do not have permission to access this resource',
    });
  };
}

module.exports = {
  requireRole,
};
