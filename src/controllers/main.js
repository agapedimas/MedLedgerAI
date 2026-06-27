const fs = require("fs");
const path = require("path");

const Accounts = require("../modules/accounts");
const Authentications = require("../modules/authentications");
const Language = require("../modules/language");
const Renderer = require("../utils/renderer");

const pictureFolderPath = path.resolve(__dirname, "../../data/pp");

async function getAvatar(req, res, next) {
    // Set cache of avatar to 1 year, because it can be refreshed with 'pictureid' query
    res.header("Cache-Control", "public, max-age=31536000");
    res.header("Content-Type", "image/webp");

    const accountId = req.params.accountId;

    // Check if picture id exists
    const pictureId = await Accounts.getPictureId(accountId);

    if (pictureId == null)
        return res.status(404).send();

    const avatarPath = pictureFolderPath + "/" + pictureId;

    if (fs.existsSync(avatarPath))
        return res.sendFile(avatarPath);
    else
        return res.sendFile("./src/assets/avatar.webp", { root: "./" });
}

async function setAvatar(req, res, next) {
    const account = await Accounts.getByAuthenticationId(req.session.account);

    if (!account)
        return res.status(403).send();

    const buffer = req.files.file.data;

    if (buffer.length > 3000000)
        return res.status(400).send("Ukuran file tidak boleh melebihi 3 MB.");

    await Accounts.setPicture(account.id, buffer);
    res.send();
}

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
        (path.startsWith("patient") || path.startsWith("doctor")) ? 
            "dashboard" : "main";

    if (isHtml) {
        let data;
        if (isIndex)
            data = fs.readFileSync(rootPath + path + "/index.html", { encoding: "utf-8" });
        else
            data = fs.readFileSync(rootPath + path + ".html", { encoding: "utf-8" });

        let renderedPage = Renderer.renderPage(pageType, data, req.session.language, path, req.contentOnly == true);
    
        if (req.variables)
            for (const variable of Object.keys(req.variables))
                renderedPage = renderedPage.replace(new RegExp("<#\\?(| )" + variable + "(| )\\?#>", "gi"), req.variables[variable] || "");

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
    getAvatar, setAvatar,
    map
}