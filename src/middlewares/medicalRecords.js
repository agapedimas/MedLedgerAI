const Middlewares = require("./");
const Controllers = require("../controllers/medicalRecords");
const Server = Middlewares.getServer();

Server.post("/api/records/upload", Controllers.uploadRecord);
Server.get("/api/records", Controllers.getRecords);