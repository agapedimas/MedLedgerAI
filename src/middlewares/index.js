const Express = require("express");
const Server = Express();
const Session = require("express-session");
const MySQLStore = require("express-mysql-session")(Session);
const BodyParser = require("body-parser");
const FileUpload = require("express-fileupload");
const Database = require("../database");

async function initialize() {
    const dbPool = Database.getPool();
    const sessionStore = new MySQLStore({}, dbPool);

    Server.use(BodyParser.urlencoded({ limit: "50mb", extended: true }));
    Server.use(BodyParser.json({ limit: "50mb" }));
    Server.use(FileUpload());
    Server.set("trust proxy", true);

    Server.use(Session({
        key: "session_cookie_name",
        // A secret key used to sign the session ID cookie.
        // This should be a long, random string stored in environment variables for security.
        secret: process.env.SESSION_KEY,
        // Prevents saving a session that is "uninitialized" (new but not modified).
        // This reduces server storage usage and helps with privacy compliance.
        saveUninitialized: false,
        cookie: 
        { 
            httpOnly: "auto",
            secure:  "auto",
            // Cookies saved for 1 year
            maxAge: 12 * 30 * 24 * 60 * 60 * 1000
        },
        store: sessionStore,
        resave: false 
    }));

    Server.use(async function(req, res, next) {
        const file = {
    		icons: /\.(?:ico)$/i,
    		fonts: /\.(?:ttf|woff2)$/i,
    		images:/\.(?:png|webp|jpg|jpeg|bmp|svg)$/i
        }
    	
    	for (const [key, value] of Object.entries(file)) {
    		if (value.test(req.url)) {
                // cache for 7 days
    			res.header("Cache-Control", "public, max-age=604800");
			}
			else if (req.query.cache == "false")
			{
				res.header("Cache-Control", "no-cache, no-store, must-revalidate");
				res.header("Pragma", "no-cache");
				res.header("Expires", "0");
			}
    	}

        req.variables = {};

        if (req.query.contentOnly == "true")
            req.contentOnly = true;

        next();
    });

    // read every middleware components
    require("./ping");
    require("./language");
    require("./auth");
    require("./admin");
    require("./medicalRecords");
    require("./consents");
    require("./accessLogs");
    require("./chats");
    require("./main");
}

function getServer() {
    return Server;
}

module.exports = {
    initialize,
    getServer
}