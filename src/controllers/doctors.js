const Doctors = require("../modules/doctors");

/**
 * Get all registered doctors with their clinic and specialty info
 */
async function getDoctors(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const doctors = await Doctors.getAll();

    return res.send(doctors);
}

module.exports = {
    getDoctors
}