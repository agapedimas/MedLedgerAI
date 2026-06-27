const Middlewares = require("./");
const Controllers = require("../controllers/doctors");
const Server = Middlewares.getServer();

Server.get("/api/doctors", Controllers.getDoctors);