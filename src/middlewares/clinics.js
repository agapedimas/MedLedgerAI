const Middlewares = require("./");
const Controllers = require("../controllers/clinics");
const Server = Middlewares.getServer();

Server.get("/api/clinics", Controllers.getClinics);