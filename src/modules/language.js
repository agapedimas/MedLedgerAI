const fs = require("fs");
const Path = require("path");
const Path_Language = "./src/assets/languages/";

/**
 * @returns { void }
 */
function Initialize() 
{
	if (fs.existsSync(Path_Language) == false)
		return;

	const languages = 
		// only read folders and filter unwanted files
		fs.readdirSync(Path_Language, { withFileTypes: true })
			.map(o => o.isDirectory() ? o.name : null)
			.filter(Boolean);

	for (let i = 0; i < languages.length; i++)
	{
		const language =  languages[i];
		Languages[i] = language;
		Data[language] = {};
		const components = fs.readdirSync(Path_Language + language);
			// only read json files
			fs.readdirSync(Path_Language + language, { withFileTypes: true })
				.map(o => o.isFile() && o.name.endsWith(".json") ? o.name : null)
				.filter(Boolean);

		for (let component of components)
		{	
			let name = Path.parse(component).name;
			let value = fs.readFileSync(Path_Language + language + "\/" + component, { encoding: "utf8" });

			Data[language][name] = JSON.parse(value.toString());
		}
	}
}

/**
 * Compiles string for specific language and page by accessing: <$ [page] [param] />
 * 
 * **For example:** \
 * `<$ home welcome />` will fetches file `./src/languages/xx/home.json` and returns value of key `welcome`
 */
function Compile(content, language)
{
	const language_prefix = content.match(/<\$(.*?)\/>/g);
	if (language_prefix != null) 
	{
		for (const prefix of language_prefix)
		{
			let page = prefix.substring(2, prefix.length - 2).split(" ")[1];
			let param = prefix.substring(2, prefix.length - 2).split(" ")[2];
			let replacement = prefix;

			if (Data[language][page] != null && Data[language][page][param] != null)
				replacement = Data[language][page][param];
				
			content = content.replaceAll(prefix, replacement);
		}
	}

	return content;
}


const Data = {}
const Languages = [];

module.exports =
{
    /** 
     * List of available language 
     * @type {Array<string>}
     */
	Available: Languages,
    /**
     * Get string for specific language and page by accessing: `Language.Data.<lang>.<page>.<param>`.
     * 
     * **For example:** \
     * `Language.Data["en"]["home"]["welcome"]` will fetches file `./src/languages/en/home.json` and returns value of key `welcome`
     */
	Data: Data,
	Compile: Compile,
	Initialize: Initialize
};