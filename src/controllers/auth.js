const Accounts = require("../modules/accounts");
const Authentications = require("../modules/authentications");

/**
 * Check if user already signed in
 */
async function needSignIn(req, res, next) {
    if (req.session.account && await Authentications.checkAccess(req.session.account) == true) {
        const account = await Accounts.getByAuthenticationId(req.session.account);
        if (account.role == "doctor")
            return res.send({ redirect: "/doctor" });
        else if (account.role == "patient")
            return res.send({ redirect: "/patient" });
        else 
            return res.status(504).send("Role akun ini tidak diketahui.");
    }
    else {
        next();
    }
}

/**
 * Handle user sign in, create session, and determine redirect path based on role
 */
async function confirmSignIn(req, res, next) {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const isValid = await Authentications.checkCredentials(email, password);

    if (isValid == true) {
        const account = await Accounts.getByEmail(email);
        const authenticationId = await Authentications.add(account.id, req.ip);
        req.session.account = authenticationId;
        if (account.role == "doctor")
            return res.send({ redirect: "/doctor" });
        else if (account.role == "patient")
            return res.send({ redirect: "/patient" });
        else 
            return res.status(504).send("Role akun ini tidak diketahui.");
    }
    else {
        return res.status(401).send("Email atau kata sandi salah.");
    }
}

/**
 * Handle new user registration with default patient role and auto sign in
 */
async function confirmSignUp(req, res, next) {
    const email = req.body.email?.trim();
    const fullname = req.body.fullname?.trim();
    const password = req.body.password;

    // Validate required fields
    if (!email || !fullname || !password) {
        return res.status(400).send("Email, nama lengkap, dan kata sandi wajib diisi.");
    }

    // Check if email is already taken
    const existingAccount = await Accounts.getByEmail(email);
    if (existingAccount) {
        return res.status(409).send("Email sudah terdaftar.");
    }

    // Register as patient by default
    const accountId = await Accounts.add(email, fullname, password, "patient");
    
    // Automatically log in the newly created account
    const authenticationId = await Authentications.add(accountId, req.ip);
    req.session.account = authenticationId;
    
    return res.send();
}

/**
 * Handle user sign out and destroy session
 */
async function confirmSignOut(req, res, next) {
    if (req.session.account) {
        await Authentications.remove(req.session.account);
        delete req.session.account;
    }

    return res.redirect("/signin");
}

module.exports = {
    needSignIn,
    confirmSignIn, confirmSignUp, confirmSignOut
}