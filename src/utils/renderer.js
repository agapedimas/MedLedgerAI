const Language = require("../modules/language");
const Template = require("../modules/template");
const Configuration = require("../config");

const appConfig = Configuration.get("app");

/**
 * @param { "dashboard" | "main" } pageType 
 * @param { string } content 
 * @param { string } language 
 * @param { string } path 
 * @param { boolean } showContentOnly
 * @returns { string } 
 */
function renderPage(pageType = "main", content = "", language = "en", path = "", showContentOnly = false) {

    const ApplyTemplate = function(type) {
        return "<!DOCTYPE html>" +
            "<html " + Template.Data.Configuration + ">" +
                "<head>" +
                    (type == "auth" ? Template.Data.Head_Auth : type === "dashboard" ? Template.Data.Head_Dashboard : Template.Data.Head) +
                "</head>" +
                "<body>" +
                    (type == "auth" ? Template.Data.Body_Auth : type === "dashboard" ? Template.Data.Body_Dashboard : Template.Data.Body) +
                    Template.Data.Title +
                "</body>" +
            "</html>";
    };

    let html = showContentOnly ? content : ApplyTemplate(pageType);

    html = html
        .replace("<#? content ?#>", content)
        .replace("<#? navigation ?#>", (pageType === "dashboard" ? (path.startsWith("/doctor") ? Template.Data.Navigation_Doctor : Template.Data.Navigation_Patient) : Template.Data.Navigation))
        .replace("<#? appsettings ?#>", Template.Data.Settings)
        .replaceAll("<#? applang ?#>", language)
        .replaceAll("<#? apptitle ?#>", appConfig.name)
        .replaceAll("<#? appicon ?#>", appConfig.icon)
        .replaceAll("<#? appassets ?#>", appConfig.path.ui)
        .replaceAll("<#? apphost ?#>", appConfig.path.host)
        .replaceAll("<#? appversion ?#>", appConfig.version);

    let hrefLang = "<link rel='alternate' hreflang='x-default' href='" + appConfig.path.host + "/" + path + "'>";
    
    for (const lang of Language.Available) {
        hrefLang += "<link rel='alternate' hreflang='" + lang + "' href='" + appConfig.path.host + "/" + lang + "/" + path + "'>";
    }

    html = html.replaceAll("<#? hreflang ?#>", hrefLang);
    html = Language.Compile(html, language);

    const language_prefix = html.match(/<\$(.*?)\/>/g);
    if (language_prefix !== null) {
        for (const prefix of language_prefix) {
            const page = prefix.substring(2, prefix.length - 2).split(" ")[1];
            const param = prefix.substring(2, prefix.length - 2).split(" ")[2];
            let replacement = prefix;

            if (Language.Data[language]?.[page]?.[param] != null) {
                replacement = Language.Data[language][page][param];
            }
                
            html = html.replaceAll(prefix, replacement);
        }
    }

    const pageVariables = [
        { prefix: "ad-title", replacement: "page_title", default: appConfig.name },
        { prefix: "ad-name", replacement: "page_name", default: appConfig.name },
        { prefix: "ad-desc", replacement: "page_description" },
        { prefix: "ad-keyword", replacement: "page_keywords" },
        { prefix: "ad-thumbnail", replacement: "page_thumbnail" }
    ];
    
    for (const variable of pageVariables) {
        variable.default = variable.default ?? ""; 
        
        const pattern = new RegExp("<" + variable.prefix + ">(.*?)</" + variable.prefix + ">", "g");
        const result = pattern.exec(html);
        const elements = html.match(pattern);

        if (result !== null && result[1].trim() !== "") {
            html = html.replaceAll("<#? " + variable.replacement + " ?#>", result[1]);
            for (const element of elements) {
                html = html.replaceAll(element, "");
            }
        } 
        else {
            html = html.replaceAll("<#? " + variable.replacement + " ?#>", variable.default);
        }
    }

    return html;
}

module.exports = {
    renderPage
};