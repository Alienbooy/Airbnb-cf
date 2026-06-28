const AuditLog = require('../domain/AuditLog');
const { publishEvent } = require('../infrastructure/kafka/producer');
const auditLogRepository = require('../infrastructure/database/AuditLogRepository');

class ModerateListingUseCase {
    async execute({ adminId, listingId, action, reason }) {
        if (!['APPROVE', 'REJECT'].includes(action)) {
            throw new Error("Invalid action. Must be APPROVE or REJECT.");
        }

        // 1. Create Audit Log
        const log = AuditLog.create({
            adminId,
            action: action === 'APPROVE' ? 'APPROVE_LISTING' : 'REJECT_LISTING',
            targetId: listingId,
            details: { reason }
        });

        await auditLogRepository.save(log);

        // 2. Publish Domain Event to Kafka
        const eventName = action === 'APPROVE' ? 'ListingApprovedEvent' : 'ListingRejectedEvent';
        const topic = 'listings.events'; // Kafka topic where alojamientos_service will listen
        
        await publishEvent(topic, eventName, {
            listingId,
            adminId,
            reason
        });

        return log;
    }
}

module.exports = new ModerateListingUseCase();
