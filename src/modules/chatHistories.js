const Database = require("../database");
const ChatHistory = require("../models/chatHistory");

/**
 * @param { typeof ChatHistory.prototype.patientId } patientId 
 * @param { typeof ChatHistory.prototype.sender } sender 
 * @param { typeof ChatHistory.prototype.message } message 
 * @returns { Promise<typeof ChatHistory.prototype.id> }
 */
async function add(patientId, sender, message) {
    const result = 
        await Database.doQuery(`
            INSERT INTO ChatHistory (patientId, sender, message)
            VALUES (?, ?, ?)
        `, [patientId, sender, message]);

    return result.data?.insertId;
}

/**
 * @param { typeof ChatHistory.prototype.patientId } patientId 
 * @returns { Promise<Array<ChatHistory>> }
 */
async function getByPatientId(patientId) {
    const results = await Database.doQuery("SELECT * FROM ChatHistory WHERE patientId = ? ORDER BY time ASC", patientId);
    return results.data?.map(o => Object.assign(new ChatHistory(), o)) || [];
}

/**
 * @param { typeof ChatHistory.prototype.patientId } patientId 
 * @returns { Promise<boolean> }
 */
async function clear(patientId) {
    const result = await Database.doQuery("DELETE FROM ChatHistory WHERE patientId = ?", patientId);
    return result.isSuccess;
}

module.exports = {
    add, getByPatientId, clear
};