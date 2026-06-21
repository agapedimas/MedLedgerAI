const Middlewares = require("./");
const Controllers = require("../controllers/accessLogs");
const Server = Middlewares.getServer();

Server.get("/api/logs", Controllers.getPatientLogs);