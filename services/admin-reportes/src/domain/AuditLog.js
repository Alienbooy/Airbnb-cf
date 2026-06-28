const { v4: uuidv4 } = require('uuid');

class AuditLog {
    constructor({ id, adminId, action, targetId, details, createdAt }) {
        this.id = id || uuidv4();
        this.adminId = adminId;
        this.action = action; // e.g., 'APPROVE_LISTING', 'REJECT_LISTING', 'BLOCK_USER'
        this.targetId = targetId; // ID of the listing or user affected
        this.details = details || {};
        this.createdAt = createdAt || new Date();
    }

    static create({ adminId, action, targetId, details }) {
        if (!adminId) throw new Error("adminId is required");
        if (!action) throw new Error("action is required");
        if (!targetId) throw new Error("targetId is required");

        return new AuditLog({ adminId, action, targetId, details });
    }
}

module.exports = AuditLog;
