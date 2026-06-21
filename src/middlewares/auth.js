const Middlewares = require("./");
const Controllers = require("../controllers/auth");
const Server = Middlewares.getServer();

Server.post("/signin", Controllers.signIn);
Server.post("/signup", Controllers.signUp);
Server.get("/signout", Controllers.signOut);