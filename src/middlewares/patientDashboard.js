const Middlewares = require(".");
const Controllers = require("../controllers/patientDashboard");
const Authentications = require("../modules/authentications");
const Server = Middlewares.getServer();

// UI Render Routes
Server.get("/patient*", Controllers.preRender);

// Apply access check to all patient API routes
Server.get("/api/patient*", Controllers.checkAccess);
Server.post("/api/patient*", Controllers.checkAccess);
Server.put("/api/patient*", Controllers.checkAccess);
Server.patch("/api/patient*", Controllers.checkAccess);
Server.delete("/api/patient*", Controllers.checkAccess);