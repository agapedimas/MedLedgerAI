const Database = require("../database");
const AccessLog = require("../models/accessLog");

/**
 * @param { typeof AccessLog.prototype.recordId } recordId 
 * @param { typeof AccessLog.prototype.accessedBy } accessedBy 
 * @param { typeof AccessLog.prototype.ipAddress } ipAddress 
 * @param { typeof AccessLog.prototype.action } action 
 * @returns { Promise<typeof AccessLog.prototype.id> }
 */
async function add(recordId, accessedBy, ipAddress, action) {
    const result = 
        await Database.doQuery(`
            INSERT INTO AccessLog (recordId, accessedBy, ipAddress, action)
            VALUES (?, ?, ?, ?)
        `, [recordId, accessedBy, ipAddress, action]);

    return result.data?.insertId;
}

/**
 * @param { typeof AccessLog.prototype.recordId } recordId 
 * @returns { Promise<Array<AccessLog>> }
 */
async function getByRecordId(recordId) {
    const results = await Database.doQuery("SELECT * FROM AccessLog WHERE recordId = ? ORDER BY time DESC", recordId);
    return results.data?.map(o => Object.assign(new AccessLog(), o)) || [];
}

/**
 * @param { string } patientId 
 * @returns { Promise<Array<AccessLog>> }
 */
async function getByPatientId(patientId) {
    const query = `
        SELECT AccessLog.* FROM AccessLog
        JOIN MedicalRecord ON MedicalRecord.id = AccessLog.recordId
        WHERE MedicalRecord.patientId = ?
        ORDER BY AccessLog.time DESC
    `;
    const results = await Database.doQuery(query, patientId);
    return results.data?.map(o => Object.assign(new AccessLog(), o)) || [];
}

module.exports = {
    add, getByRecordId, getByPatientId
};