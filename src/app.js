console.log(
	"Starting Server |",
	new Date().toLocaleDateString(), 
	"|",
	new Date().toLocaleTimeString()
);

const Database = require("./database");
const Middlewares = require("./middlewares");
const Configuration = require("./config");

const Functions = require("./functions");
const Template = require("./template");
const Language = require("./language");
const Route = require("./route");

async function initialize()
{
	await Database.initialize();
	await Middlewares.initialize();
	await Template.Initialize();
	await Language.Initialize();

	const appPort = Configuration.get("app").port;
	
	Middlewares.getServer()
		.listen(appPort, function()  
		{
			if (process.env.production) {
				console.log("Server is ready");
			}
			else {
				console.log("Server for development is ready. Go to http://localhost:" + appPort);
				console.error("This server is running under development mode.");
			}
		});
}

initialize();