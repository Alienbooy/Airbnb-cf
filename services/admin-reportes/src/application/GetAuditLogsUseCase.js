const auditLogRepository = require('../infrastructure/database/AuditLogRepository');

class GetAuditLogsUseCase {
    async execute() {
        return await auditLogRepository.findAll();
    }
}

module.exports = new GetAuditLogsUseCase();
