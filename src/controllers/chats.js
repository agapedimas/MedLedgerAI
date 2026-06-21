const Accounts = require("../modules/accounts");
const ChatHistories = require("../modules/chatHistories");

/**
 * Process new chat message and generate AI response
 */
async function sendMessage(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const account = await Accounts.getByAuthenticationId(req.session.account);
    const message = req.body.message;

    if (!message) {
        return res.status(400).send("Pesan tidak boleh kosong.");
    }

    await ChatHistories.add(account.id, "user", message);

    // Dummy AI response generation
    const mockAiResponse = "Ini adalah respon otomatis simulasi berdasarkan rekam medis Anda.";

    await ChatHistories.add(account.id, "assistant", mockAiResponse);

    return res.send({ reply: mockAiResponse });
}

/**
 * Retrieve complete conversation history for the patient
 */
async function getChatHistory(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const account = await Accounts.getByAuthenticationId(req.session.account);
    const history = await ChatHistories.getByPatientId(account.id);

    return res.send(history);
}

/**
 * Wipe patient chat context from database
 */
async function clearChat(req, res, next) {
    if (!req.session.account) return res.status(401).send();
    
    const account = await Accounts.getByAuthenticationId(req.session.account);
    await ChatHistories.clear(account.id);

    return res.send();
}

module.exports = {
    sendMessage, getChatHistory, clearChat
}