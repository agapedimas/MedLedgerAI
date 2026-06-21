const Accounts = require("../modules/accounts");
const Authentications = require("../modules/authentications");

/**
 * Handle user sign in, create session, and determine redirect path based on role
 */
async function signIn(req, res, next) {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const isValid = await Authentications.checkCredentials(email, password);

    if (isValid == true) {
        const account = await Accounts.getByEmail(email);
        const authenticationId = await Authentications.add(account.id, req.ip);
        req.session.account = authenticationId;
        
        // Determine redirect path based on user role
        let targetPath;
        if (account.role === "owner" || account.role === "admin") {
            targetPath = "/admin";
        } 
        else if (account.role === "doctor") {
            targetPath = "/doctor";
        }
        else {
            targetPath = "/patient";
        }
        
        return res.send({ redirect: targetPath });
    }
    else {
        return res.status(401).send("Email atau kata sandi salah.");
    }
}

/**
 * Handle new user registration with default patient role and auto sign in
 */
async function signUp(req, res, next) {
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