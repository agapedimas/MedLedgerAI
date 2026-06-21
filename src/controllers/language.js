const Language = require("../modules/language");

function setLanguage(req, res, next) {
    if (Language.Available.includes(req.params.languageId)) {
        req.session.language = req.params.languageId;
        return res.send();
    }
    else {
        return res.status(404).send("Language is not available.");
    }
}

function getLanguagedFile(req, res, next) {
    if (Language.Available.includes(req.params.language)) {
        // If user visit page with language path
        if (req.path.endsWith(".js") == false && req.path.endsWith(".css") == false) {
            req.session.language = req.params.language;
            return res.redirect("/" + req.params[0]);
        }

        req.filePath = "./public/" + req.params[0];
    }

    return next();
}

module.exports = {
    setLanguage,
    getLanguagedFile
}