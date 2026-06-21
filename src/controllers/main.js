const fs = require("fs");

const Accounts = require("../modules/accounts");
const Authentications = require("../modules/authentications");
const Language = require("../modules/language");
const Renderer = require("../utils/renderer");

async function map(req, res, next) {
    const prettyPath = prettifyPath(req);
    const path = prettyPath.result;

    // If needs refresh
    if (prettyPath.refresh)
        return res.redirect("/" + path);

    const rootPath = req.filePath ? "" : "./src/public/";
    const isHtml = 
        fs.existsSync(rootPath + path + ".html") || 
        fs.existsSync(rootPath + path + "/index.html");
    const isJs =
        path.endsWith(".js") && fs.existsSync(rootPath + path);
    const isCss = 
        path.endsWith(".css") && fs.existsSync(rootPath + path);
    const isIndex = 
        isHtml ? 
            fs.existsSync(rootPath + path + ".html") == false : 
            false;
    const isImage = /(\.png|\.webp|\.jpg|\.bmp|\.jpeg)$/g.test(path);
    const pageType = 
        (path.startsWith("signin") || path.startsWith("signup")) ?
            "auth" :
        (path.startsWith("admin") || req.isAdmin == true) ? 
            "admin" : "main";

    if (isHtml) {
        let data;
        if (isIndex)
            data = fs.readFileSync(rootPath + path + "/index.html", { encoding: "utf-8" });
        else
            data = fs.readFileSync(rootPath + path + ".html", { encoding: "utf-8" });

        const renderedPage = Renderer.renderPage(pageType, data, req.session.language, path, req.contentOnly == true);
    
        if (req.variables)
            for (const variable of Object.keys(req.variables))
                renderedPage = data.replace(new RegExp("<#\\?(| )" + variable + "(| )\\?#>", "gi"), req.variables[variable] || "");
        
        res.send(renderedPage);
    }
    else if (isJs || isCss) {
        if (isJs)
            res.header("Content-Type", "text/javascript; charset=utf-8");
        else if (isCss)
            res.header("Content-Type", "text/css");
        
        let data = fs.readFileSync(rootPath + path).toString();
        data = Language.Compile(data, req.session.language);
        res.send(data);
    }
    else {
        if (fs.existsSync(rootPath + path)) {
            res.sendFile(rootPath + path, { root: "./" });
        }
        else {
            if (isImage)
                res.status(404).sendFile("./src/assets/blank.png", { root: "./" });
            else
                res.status(404).sendFile("./src/assets/errors/404.shtml", { root: "./" });
        }
    }
}


/**
 * Make the URL tidy
 * @param { string } path
 * @returns { {
 *      refresh: boolean,
 *      result: string
 * }} 
 */
function prettifyPath(req)
{
    if (req.filePath)
        return {
            refresh: false,
            result: req.filePath
        };

    let path = req.path;
    let refresh = false;

    if (path.startsWith("//"))
        refresh = true;

    while (path.startsWith("/"))
        path = path.substring(1);

    if (path.includes("//"))
    {
        refresh = true;
        path = path.replaceAll("//", "/");
    }
    if (path.endsWith("/"))
    {
        refresh = true;
        path = path.substring(0, path.length - 1);
    }
    if (path.endsWith(".html"))
    {
        refresh = true;
        path = path.substring(0, path.length - 5);
    }
    if (path.endsWith(".shtml"))
    {
        refresh = true;
        path = path.substring(0, path.length - 6);
    }
    
    return {
        refresh: refresh, 
        result: path
    }
}

module.exports = {
    map
}