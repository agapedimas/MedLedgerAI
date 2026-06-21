const Accounts = require("../modules/accounts");
const MedicalRecords = require("../modules/medicalRecords");
const AccessLogs = require("../modules/accessLogs");

/**
 * Handle medical record document upload
 */
async function uploadRecord(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const account = await Accounts.getByAuthenticationId(req.session.account);
    const patientId = req.body.patientId;
    const title = req.body.title;
    
    const fileBuffer = req.file?.buffer; 
    const fileExt = req.file?.originalname.substring(req.file.originalname.lastIndexOf("."));

    if (!fileBuffer) {
        return res.status(400).send("File tidak ditemukan.");
    }

    const recordId = await MedicalRecords.add(patientId, account.id, title, fileBuffer, fileExt);

    // Track who uploaded the record
    await AccessLogs.add(recordId, account.id, req.ip, "CREATE_RECORD");

    return res.send({ id: recordId });
}

/**
 * Retrieve medical records based on user role
 */
async function getRecords(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const account = await Accounts.getByAuthenticationId(req.session.account);
    let records = [];

    if (account.role === "patient") {
        records = await MedicalRecords.getAllByPatientId(account.id);
    } 
    else {
        records = await MedicalRecords.getAllByDoctorId(account.id);
    }

    return res.send(records);
}

module.exports = {
    uploadRecord, getRecords
}