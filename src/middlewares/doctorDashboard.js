const Middlewares = require(".");
const Controllers = require("../controllers/doctorDashboard");
const Authentications = require("../modules/authentications");
const Server = Middlewares.getServer();

// UI Render Routes
Server.get("/doctor*", Controllers.preRender);

// Apply access check to all patient API routes
Server.get("/api/doctor*", Controllers.checkAccess);
Server.post("/api/doctor*", Controllers.checkAccess);
Server.put("/api/doctor*", Controllers.checkAccess);
Server.patch("/api/doctor*", Controllers.checkAccess);
Server.delete("/api/doctor*", Controllers.checkAccess);