const path = require("path");

const Accounts = require("../modules/accounts");
const Authentications = require("../modules/authentications");
const AdminStats = require("../modules/adminStats");

/**
 * Middleware to ensure the user has owner, admin, or patient privileges
 */
async function checkAccess(req, res, next) {
    if (await Authentications.checkAccess(req.session.account, ["owner", "admin", "patient"]))
        next();
    else
        return res.status(403).send();
}

/**
 * Handle initial page rendering and inject active user context
 */
async function preRender(req, res, next) {
    if (await Authentications.checkAccess(req.session.account, ["owner", "admin", "patient"]) == false) {
        // If path doesn't specify file extension
        if (!path.extname(req.path))
            return res.redirect("/signin?continue=" + decodeURIComponent(req.url));
        else
            return res.status(403).send();
    }

    const account = await Accounts.getByAuthenticationId(req.session.account);
    
    Object.assign(req.variables, {
        "activeUser": JSON.stringify(account),
        "activeUser.id": account?.id,
        "activeUser.email": account?.email,
        "activeUser.fullname": account?.fullname,
        "activeUser.pictureId": account?.pictureId,
        "activeUser.role": account?.role,
        "activeUser.created": account?.created
    });

    return next();
}

/**
 * Retrieve all registered accounts
 */
async function getAllAccounts(req, res, next) {
    const users = await Accounts.getAll();
    return res.send(users);
}

/**
 * Change the role of a specific account (e.g. patient to doctor)
 */
async function changeAccountRole(req, res, next) {
    const accountId = req.body.accountId;
    const newRole = req.body.role;

    if (!accountId || !newRole) {
        return res.status(400).send("Account ID atau role wajib diisi.");
    }

    const isSuccess = await Accounts.update(accountId, null, null, null, newRole, null);
    
    if (isSuccess) {
        return res.send();
    } else {
        return res.status(500).send("Gagal memperbarui role akun.");
    }
}

/**
 * Permanently delete a user account
 */
async function deleteAccount(req, res, next) {
    const accountId = req.body.accountId;
    
    if (!accountId) {
        return res.status(400).send("Account ID wajib diisi.");
    }

    const isSuccess = await Accounts.remove(accountId);
    
    if (isSuccess) {
        return res.send();
    } else {
        return res.status(500).send("Gagal menghapus akun.");
    }
}

/**
 * Retrieve system-wide statistics for the admin dashboard
 */
async function getStats(req, res, next) {
    const stats = await AdminStats.getSystemStats();
    return res.send(stats);
}

module.exports = {
    checkAccess, preRender,
    getAllAccounts, changeAccountRole, deleteAccount, getStats
}