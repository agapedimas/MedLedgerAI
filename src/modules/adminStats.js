const Database = require("../database");

/**
 * @returns { Promise<{ totalAccounts: number, totalRecords: number, totalLogs: number }> }
 */
async function getSystemStats() {
    const stats = {
        totalAccounts: 0,
        totalRecords: 0,
        totalLogs: 0
    };

    const accountResult = await Database.doQuery("SELECT COUNT(id) as count FROM Account");
    stats.totalAccounts = accountResult.data?.at(0)?.count || 0;

    const recordResult = await Database.doQuery("SELECT COUNT(id) as count FROM MedicalRecord");
    stats.totalRecords = recordResult.data?.at(0)?.count || 0;

    const logResult = await Database.doQuery("SELECT COUNT(id) as count FROM AccessLog");
    stats.totalLogs = logResult.data?.at(0)?.count || 0;

    return stats;
}

module.exports = {
    getSystemStats
};