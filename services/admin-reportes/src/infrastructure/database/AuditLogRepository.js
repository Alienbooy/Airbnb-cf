const { AuditLogModel } = require('./index');
const AuditLog = require('../../domain/AuditLog');

class AuditLogRepository {
    async save(auditLog) {
        await AuditLogModel.create({
            id: auditLog.id,
            adminId: auditLog.adminId,
            action: auditLog.action,
            targetId: auditLog.targetId,
            details: auditLog.details,
            createdAt: auditLog.createdAt
        });
    }

    async findAll() {
        const logs = await AuditLogModel.findAll({ order: [['createdAt', 'DESC']] });
        return logs.map(log => new AuditLog(log.toJSON()));
    }
}

module.exports = new AuditLogRepository();
