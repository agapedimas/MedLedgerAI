const Middlewares = require("./");
const Controllers = require("../controllers/chats");
const Server = Middlewares.getServer();

Server.post("/api/chat/send", Controllers.sendMessage);
Server.get("/api/chat/history", Controllers.getChatHistory);
Server.delete("/api/chat/clear", Controllers.clearChat);