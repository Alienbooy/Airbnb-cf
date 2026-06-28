const moderateListingUseCase = require('../../application/ModerateListingUseCase');
const getAuditLogsUseCase = require('../../application/GetAuditLogsUseCase');

class AdminController {
    async moderateListing(req, res) {
        try {
            const adminId = req.header('X-User-Id');
            if (!adminId) {
                return res.status(401).json({ error: "Missing admin user id" });
            }

            // In APISIX forward-auth, we might have roles in X-User-Roles
            const roles = req.header('X-User-Roles') || '';
            if (!roles.includes('admin')) {
                return res.status(403).json({ error: "Only admins can moderate listings" });
            }

            const { id } = req.params;
            const { action, reason } = req.body;

            const log = await moderateListingUseCase.execute({
                adminId,
                listingId: id,
                action,
                reason
            });

            return res.status(200).json({ message: "Action processed successfully", log });
        } catch (error) {
            console.error('Error moderating listing:', error);
            return res.status(400).json({ error: error.message });
        }
    }

    async getAuditLogs(req, res) {
        try {
            const roles = req.header('X-User-Roles') || '';
            if (!roles.includes('admin')) {
                return res.status(403).json({ error: "Only admins can view audit logs" });
            }

            const logs = await getAuditLogsUseCase.execute();
            return res.status(200).json(logs);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

module.exports = new AdminController();
