const Middlewares = require("./");
const Controllers = require("../controllers/consents");
const Server = Middlewares.getServer();

Server.post("/api/consents/update", Controllers.updateConsentStatus);
Server.get("/api/consents", Controllers.getMyConsents);