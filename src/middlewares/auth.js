const Middlewares = require("./");
const Controllers = require("../controllers/auth");
const Server = Middlewares.getServer();

Server.get("/signin", Controllers.needSignIn);
Server.get("/signup", Controllers.needSignIn);

Server.post("/signin", Controllers.confirmSignIn);
Server.post("/signup", Controllers.confirmSignUp);

Server.get("/signout", Controllers.confirmSignOut);