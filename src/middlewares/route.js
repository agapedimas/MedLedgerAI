const SQL = require("./sql");
const Variables = require("./variables");
const Authentication = require("./authentication");
const Accounts = require("../modules/accounts");
const Functions = require("../modules/functions");
const Language = require("../modules/language");
const fs = require("fs");

/**
 * @param { import("express").Application } Server Express instance
 * @returns { void }
 */
function Route(Server) 
{      

    // CUSTOM ROUTE HERE
    // Server.get(function(req, res) ...)

    Map(Server);
}

function Map(Server)
{
    Server.get("*", async function(req, res)
    {
        const prettyPath = PrettifyPath(req);
        const path = prettyPath.result;
        
        if (prettyPath.refresh)
        {
            res.redirect("/" + prettyPath.result);
            return;
        }
        
        const rootPath = req.filePath ? "" : "./public/";
        const isHTML = fs.existsSync(rootPath + path + ".html") || fs.existsSync(rootPath + path + "/index.html");
        const isJS = path.endsWith(".js") && fs.existsSync(rootPath + path);
        const isCSS = path.endsWith(".css") && fs.existsSync(rootPath + path);
        const isIndex = isHTML ? fs.existsSync(rootPath + path + ".html") == false : false;
        const isImage = /(\.png|\.webp|\.jpg|\.bmp|\.jpeg)$/g.test(path);
        const pageType = path.startsWith("admin") || req.isAdmin == true ? "admin" : "public";

        if (isHTML)
        {
            let data;
            if (isIndex)
                data = fs.readFileSync(rootPath + path + "/index.html");
            else
                data = fs.readFileSync(rootPath + path + ".html");

            data = data.toString();
            data = Functions.Page_Compile(pageType, data, req.session?.language, path, req.contentOnly == true);
            
            if (req.variables)
                for (const variable of Object.keys(req.variables))
                    data = data.replace(new RegExp("<#\\?(| )" + variable + "(| )\\?#>", "gi"), req.variables[variable] || "");
            
            res.send(data);
        }
        else if (isJS || isCSS)
        {
            if (isJS)
                res.header("Content-Type", "text/javascript; charset=utf-8");
            else if (isCSS)
                res.header("Content-Type", "text/css");
            
            let data = fs.readFileSync(rootPath + path).toString();
            data = Language.Compile(data, req.session.language);
            res.send(data);
        }
        else
        {
            if (fs.existsSync(rootPath + path))
            {
                res.sendFile(rootPath + path, { root: "./" });
            }
            else
            {
                if (isImage)
                    res.status(404).sendFile("./src/blank.png", { root: "./" });
                else
                    res.status(404).sendFile("./public/404.shtml", { root: "./" });
            }
        }
    });
    
    Server.post("*", async function(req, res, next)
    {
        let path = PrettifyPath(req).result;
        
        const rootPath = req.filePath ? "" : "./public/";
        const isHTML = fs.existsSync(rootPath + path + ".html") || fs.existsSync(rootPath + path + "/index.html");
        const isIndex = isHTML ? fs.existsSync(rootPath + path + ".html") == false : false;
        const pageType = path.startsWith("admin") || req.isAdmin == true ? "admin" : "public";

        if (isHTML)
        {
            let data;
            if (isIndex)
                data = fs.readFileSync(rootPath + path + "/index.html");
            else
                data = fs.readFileSync(rootPath + path + ".html");

            data = data.toString();
            data = Functions.Page_Compile(pageType, data, req.session?.language, path, true);
            
            if (req.variables)
                for (const variable of Object.keys(req.variables))
                    data = data.replace(new RegExp("<#\\?(| )" + variable + "(| )\\?#>", "gi"), req.variables[variable] || "");
            
            res.send(data);
        }
        else
        {
            if (fs.existsSync(rootPath + path))
            {
                res.sendFile(rootPath + path, { root: "./" });
            }
            else
            {
                res.status(404).send();
            }
        }
    });
}

/**
 * Make the URL tidy
 * @param { string } path
 * @returns { {
 *      refresh: boolean,
 *      result: string
 * }} 
 */
function PrettifyPath(req)
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


module.exports = Route;