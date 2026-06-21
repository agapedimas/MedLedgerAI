const Middlewares = require("./");
const Controllers = require("../controllers/main");
const Server = Middlewares.getServer();

Server.get("*", Controllers.map);