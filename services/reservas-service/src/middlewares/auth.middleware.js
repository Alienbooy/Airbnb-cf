const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ROLE_PRIORITY = ['admin', 'host', 'guest'];

function normalizeRoleName(role) {
  if (!role || typeof role !== 'string') {
    return null;
  }

  const value = role.trim().toLowerCase();
  if (value === 'client') {
    return 'guest';
  }
  if (ROLE_PRIORITY.includes(value)) {
    return value;
  }
  return null;
}

function collectRoles(payload) {
  const values = [];

  if (payload.role) values.push(payload.role);
  if (payload.user?.role) values.push(payload.user.role);

  const roleLists = [payload.roles, payload.user?.roles];
  for (const roles of roleLists) {
    if (Array.isArray(roles)) {
      values.push(...roles);
    } else if (typeof roles === 'string') {
      values.push(...roles.split(','));
    }
  }

  const normalized = values
    .map(normalizeRoleName)
    .filter(Boolean);

  return [...new Set(normalized)];
}

function getUserId(payload) {
  return payload.user_id || payload.sub || payload.id || payload.user?.id;
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'missing_token',
      message: 'Authorization header must be Bearer TOKEN',
    });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    const userId = Number(getUserId(payload));

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        error: 'invalid_token',
        message: 'Token does not contain a valid user id',
      });
    }

    const roles = collectRoles(payload);
    const role = ROLE_PRIORITY.find((candidate) => roles.includes(candidate)) || 'guest';

    req.user = {
      id: userId,
      role,
      roles: roles.length ? roles : ['guest'],
      tokenPayload: payload,
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'token_expired',
        message: 'Token expired',
      });
    }

    return res.status(401).json({
      error: 'invalid_token',
      message: 'Invalid token',
    });
  }
}

module.exports = authenticate;
