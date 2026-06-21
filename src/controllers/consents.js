const Accounts = require("../modules/accounts");
const Consents = require("../modules/consents");

/**
 * Grant or revoke access for a specific doctor
 */
async function updateConsentStatus(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const account = await Accounts.getByAuthenticationId(req.session.account);
    const doctorId = req.body.doctorId;
    const status = req.body.status;

    if (!doctorId || !status) {
        return res.status(400).send("Doctor ID atau status wajib diisi.");
    }

    const isSuccess = await Consents.setStatus(account.id, doctorId, status);
    
    if (isSuccess) {
        return res.send();
    } else {
        return res.status(500).send("Gagal memperbarui izin akses.");
    }
}

/**
 * Get all access rules defined by the patient
 */
async function getMyConsents(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const account = await Accounts.getByAuthenticationId(req.session.account);
    const consents = await Consents.getAllByPatient(account.id);

    return res.send(consents);
}

module.exports = {
    updateConsentStatus, getMyConsents
}