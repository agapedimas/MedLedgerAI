const Middlewares = require("./");
const Server = Middlewares.getServer();

Server.post("/ping", function(req, res) {
    res.send();
});