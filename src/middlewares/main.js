const Middlewares = require("./");
const Controllers = require("../controllers/main");
const Server = Middlewares.getServer();

Server.get("/avatar/:accountId", Controllers.getAvatar);
Server.post("/avatar", Controllers.setAvatar);

Server.get("*", Controllers.map);