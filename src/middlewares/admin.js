const Middlewares = require("./");
const Controllers = require("../controllers/admin");
const Authentications = require("../modules/authentications");
const Server = Middlewares.getServer();

// Role-based protection for UI rendering
async function checkDoctorAccess(req, res, next) {
    if (await Authentications.checkAccess(req.session.account, ["doctor"]))
        next();
    else
        return res.redirect("/signin");
}

async function checkPatientAccess(req, res, next) {
    if (await Authentications.checkAccess(req.session.account, ["patient"]))
        next();
    else
        return res.redirect("/signin");
}

// UI Render Routes
Server.get("/doctor*", checkDoctorAccess, Controllers.preRender);
Server.get("/patient*", checkPatientAccess, Controllers.preRender);
Server.get("/admin*", Controllers.preRender);

// Apply access check to all admin API routes
Server.get("/api/admin*", Controllers.checkAccess);
Server.post("/api/admin*", Controllers.checkAccess);
Server.put("/api/admin*", Controllers.checkAccess);
Server.patch("/api/admin*", Controllers.checkAccess);
Server.delete("/api/admin*", Controllers.checkAccess);

// Admin API Endpoints
Server.get("/api/admin/accounts", Controllers.getAllAccounts);
Server.patch("/api/admin/accounts/role", Controllers.changeAccountRole);
Server.delete("/api/admin/accounts/delete", Controllers.deleteAccount);
Server.get("/api/admin/stats", Controllers.getStats);