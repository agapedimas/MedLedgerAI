const Accounts = require("../modules/accounts");
const AccessLogs = require("../modules/accessLogs");

/**
 * Fetch access footprint for patient dashboard
 */
async function getPatientLogs(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const account = await Accounts.getByAuthenticationId(req.session.account);
    const logs = await AccessLogs.getByPatientId(account.id);

    return res.send(logs);
}

module.exports = {
    getPatientLogs
}