const fs = require("fs");
const path = require("path");

const Hash = require("../utils/hash");
const Document = require("../utils/document");
const Database = require("../database");
const MedicalRecord = require("../models/medicalRecord");

const documentFolderPath = path.resolve(__dirname, "../data/records/");

/**
 * @param { typeof MedicalRecord.prototype.patientId } patientId
 * @returns { Promise<Array<MedicalRecord>> }
 */
async function getAllByPatientId(patientId) {
    const results = await Database.doQuery("SELECT * FROM MedicalRecord WHERE patientId = ? ORDER BY created DESC", patientId);
    return results.data?.map(o => Object.assign(new MedicalRecord(), o)) || [];
}

/**
 * @param { typeof MedicalRecord.prototype.doctorId } doctorId
 * @returns { Promise<Array<MedicalRecord>> }
 */
async function getAllByDoctorId(doctorId) {
    const results = await Database.doQuery("SELECT * FROM MedicalRecord WHERE doctorId = ? ORDER BY created DESC", doctorId);
    return results.data?.map(o => Object.assign(new MedicalRecord(), o)) || [];
}

/**
 * @param { typeof MedicalRecord.prototype.id } recordId
 * @returns { Promise<MedicalRecord?> }
 */
async function getById(recordId) {
    const results = await Database.doQuery("SELECT * FROM MedicalRecord WHERE id = ?", recordId);
    const data = results.data?.at(0);
    if (data)
        return Object.assign(new MedicalRecord(), data);
    else
        return null;
}

/**
 * @param { typeof MedicalRecord.prototype.patientId } patientId 
 * @param { typeof MedicalRecord.prototype.doctorId } doctorId 
 * @param { typeof MedicalRecord.prototype.title } title 
 * @param { Buffer } fileBuffer 
 * @param { string } fileExtension
 * @returns { Promise<typeof MedicalRecord.prototype.id> } Inserted record id
 */
async function add(patientId, doctorId, title, fileBuffer, fileExtension) {
    const uniqueFileName = Hash.generateUniqueId(patientId + Date.now()) + fileExtension;
    
    // Save physical document to disk
    await Document.saveBufferToDisk(fileBuffer, uniqueFileName, documentFolderPath);
    const fileUrl = "/data/records/" + uniqueFileName;

    const result = 
        await Database.doQuery(`
            INSERT INTO MedicalRecord (patientId, doctorId, title, fileUrl)
            VALUES (?, ?, ?, ?)
        `, [patientId, doctorId, title, fileUrl]);

    return result.data?.insertId;
}

/**
 * @param { typeof MedicalRecord.prototype.id } recordId 
 * @param { typeof MedicalRecord.prototype.aiSummary? } aiSummary 
 * @param { typeof MedicalRecord.prototype.blockchainHash? } blockchainHash 
 * @returns { Promise<boolean> }
 */
async function updateMetadata(recordId, aiSummary, blockchainHash) {
    const result = 
        await Database.doQuery(`
            UPDATE MedicalRecord
            SET
                aiSummary = COALESCE(?, aiSummary),
                blockchainHash = COALESCE(?, blockchainHash)
            WHERE
                id = ?
        `, [aiSummary, blockchainHash, recordId]);

    return result.isSuccess;
}

/**
 * @param { typeof MedicalRecord.prototype.id } recordId 
 * @returns { Promise<boolean> }
 */
async function remove(recordId) {
    const record = await getById(recordId);
    if (record && record.fileUrl) {
        const fileName = path.basename(record.fileUrl);
        const fullFilePath = path.join(documentFolderPath, fileName);
        if (fs.existsSync(fullFilePath))
            fs.unlinkSync(fullFilePath);
    }

    const result = await Database.doQuery("DELETE FROM MedicalRecord WHERE id = ?", recordId);
    return result.isSuccess;
}

module.exports = {
    getAllByPatientId, getAllByDoctorId, getById,
    add, updateMetadata, remove
};