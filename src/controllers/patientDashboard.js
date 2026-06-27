const path = require("path");

const Accounts = require("../modules/accounts");
const Authentications = require("../modules/authentications");
const AdminStats = require("../modules/adminStats");

/**
 * Middleware to ensure the user has owner, admin, or patient privileges
 */
async function checkAccess(req, res, next) {
    if (await Authentications.checkAccess(req.session.account, "patient"))
        next();
    else
        return res.status(403).send();
}

/**
 * Handle initial page rendering and inject active user context
 */
async function preRender(req, res, next) {
    if (await Authentications.checkAccess(req.session.account, "patient") == false) {
        // If user already signed in
        if (req.session.account) {
            return res.status(403).sendFile("./src/assets/errors/403.shtml", { root: "./" });
        }
        else {
            // If path doesn't specify file extension
            if (!path.extname(req.path))
                return res.redirect("/signin?continue=" + decodeURIComponent(req.url));
            else
                return res.status(403).send();
        }
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

module.exports = {
    checkAccess, preRender
}