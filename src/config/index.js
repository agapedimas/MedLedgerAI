const fs = require("fs");

const config = {};
const configFolderPath = "./src/config/";
const configFiles = fs.readdirSync(configFolderPath).filter(o => o.endsWith(".json"));

// Read files from config folder
for (const configFileName of configFiles) {
    const configFileContent = fs.readFileSync(configFolderPath + configFileName, { encoding: "utf-8" });
    const configObject = JSON.parse(configFileContent);

    const configName = configFileName.substring(0, configFileName.length - ".json".length);
    config[configName] = configObject;
}

/**
 * Get configuration object
 * @param { string } configName
 * @returns { obj? }
 */
function get(configName) {
    return config[configName];
}

module.exports = { get };