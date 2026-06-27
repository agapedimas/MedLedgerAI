const Middlewares = require(".");
const Controllers = require("../controllers/patientDashboard");
const Authentications = require("../modules/authentications");
const Server = Middlewares.getServer();

// Role-based protection for UI rendering
async function checkPatientAccess(req, res, next) {
    if (await Authentications.checkAccess(req.session.account, ["patient"]))
        next();
    else
        return res.redirect("/signin");
}

// UI Render Routes
Server.get("/patient*", checkPatientAccess, Controllers.preRender);

// Apply access check to all patient API routes
Server.get("/api/patient*", Controllers.checkAccess);
Server.post("/api/patient*", Controllers.checkAccess);
Server.put("/api/patient*", Controllers.checkAccess);
Server.patch("/api/patient*", Controllers.checkAccess);
Server.delete("/api/patient*", Controllers.checkAccess);