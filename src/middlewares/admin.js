const Middlewares = require("./");
const Controllers = require("../controllers/admin");
const Server = Middlewares.getServer();

Server.get("/admin*", Controllers.preRender);
Server.get("/api/admin*", Controllers.checkAccess);
Server.post("/api/admin*", Controllers.checkAccess);
Server.put("/api/admin*", Controllers.checkAccess);
Server.patch("/api/admin*", Controllers.checkAccess);
Server.delete("/api/admin*", Controllers.checkAccess);