const Middlewares = require("./");
const Controllers = require("../controllers/language");
const Server = Middlewares.getServer();

Server.post("/language/:languageId", Controllers.setLanguage);
Server.post("/:language/*", Controllers.getLanguagedFile);