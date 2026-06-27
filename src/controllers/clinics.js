const Clinics = require("../modules/clinics");

/**
 * Get all registered partner clinics
 */
async function getClinics(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const clinics = await Clinics.getAll();

    return res.send(clinics);
}

module.exports = {
    getClinics
}