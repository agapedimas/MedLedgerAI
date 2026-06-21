const Database = require("../database");
const Consent = require("../models/consent");

/**
 * @param { typeof Consent.prototype.patientId } patientId 
 * @param { typeof Consent.prototype.doctorId } doctorId 
 * @returns { Promise<Consent?> }
 */
async function get(patientId, doctorId) {
    const results = await Database.doQuery("SELECT * FROM Consent WHERE patientId = ? AND doctorId = ?", [patientId, doctorId]);
    const data = results.data?.at(0);
    if (data)
        return Object.assign(new Consent(), data);
    else
        return null;
}

/**
 * @param { typeof Consent.prototype.patientId } patientId 
 * @returns { Promise<Array<Consent>> }
 */
async function getAllByPatient(patientId) {
    const results = await Database.doQuery("SELECT * FROM Consent WHERE patientId = ?", patientId);
    return results.data?.map(o => Object.assign(new Consent(), o)) || [];
}

/**
 * @param { typeof Consent.prototype.patientId } patientId 
 * @param { typeof Consent.prototype.doctorId } doctorId 
 * @param { typeof Consent.prototype.status } status 
 * @returns { Promise<boolean> }
 */
async function setStatus(patientId, doctorId, status) {
    const result = 
        await Database.doQuery(`
            INSERT INTO Consent (patientId, doctorId, status)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE status = VALUES(status)
        `, [patientId, doctorId, status]);

    return result.isSuccess;
}

/**
 * @param { typeof Consent.prototype.patientId } patientId 
 * @param { typeof Consent.prototype.doctorId } doctorId 
 * @returns { Promise<boolean> }
 */
async function isAccessGranted(patientId, doctorId) {
    const results = await Database.doQuery("SELECT id FROM Consent WHERE patientId = ? AND doctorId = ? AND status = 'granted' LIMIT 1", [patientId, doctorId]);
    return (results.data?.length ?? 0) > 0;
}

module.exports = {
    get, getAllByPatient, setStatus, isAccessGranted
};