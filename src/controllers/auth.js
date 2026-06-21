const Accounts = require("../modules/accounts");
const Authentications = require("../modules/authentications");

async function signIn(req, res, next) {
    const email = req.body.email.trim();
    const password = req.body.password.trim();
    const isValid = await Authentications.checkCredentials(email, password);

    if (isValid == true) {
        const account = await Accounts.getByEmail(email);
        const authenticationId = await Authentications.add(account.id, req.ip);
        req.session.account = authenticationId;
        return res.send();
    }
    else {
        return res.status(401).send("Email or password is incorrect.");
    }
}

async function signUp(req, res, next) {
    // Not yet implemented
    return res.status(501).send();

    // Check validity
    const accountId = await Accounts.add(email, fullname, password, "member");
    // Signs in new account
    const authenticationId = await Authentications.add(accountId, req.ip);
    req.session.account = authenticationId;
    return res.send();
}

async function signOut(req, res, next) {
    if (req.session.account) {
        await Authentications.remove(req.session.account);
        delete req.session.account;
    }

    return res.redirect("/signin");
}

module.exports = {
    signIn, signUp, signOut
}