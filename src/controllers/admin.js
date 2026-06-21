const path = require("path");

const Accounts = require("../modules/accounts");
const Authentications = require("../modules/authentications");

function checkAccess(req, res, next) {
    if (Authentications.checkAccess(req.session.account, ["owner", "admin"]))
        next();
    else
        return res.status(403).send();
}

async function preRender(req, res, next) {
    if (Authentications.checkAccess(req.session.account, ["owner", "admin"]) == false) {
        // If path doesn't specify file extension
        if (!path.extname(req.path))
            return res.redirect("/signin?continue=" + decodeURIComponent(req.url));
        else
            return res.status(403).send();
    }

    const account = await Accounts.getByAuthenticationId(req.session.account);
    
    Object.assign(req.variables, {
        "activeUser": JSON.stringify(account),
        "activeUser.id": account.id,
        "activeUser.email": account.email,
        "activeUser.fullname": account.fullname,
        "activeUser.pictureId": account.pictureId,
        "activeUser.role": account.role,
        "activeUser.created": account.created
    });

    return next();
}

module.exports = {
    checkAccess,
    preRender
}