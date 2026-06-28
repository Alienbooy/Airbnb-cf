const express = require('express');
const router = express.Router();
const adminController = require('./AdminController');

// All endpoints under /api/admin
router.post('/listings/:id/moderate', adminController.moderateListing);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
