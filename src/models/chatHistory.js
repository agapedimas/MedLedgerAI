class ChatHistory {
    /**
     * @param { number } id
     * @param { string } patientId
     * @param { "user" | "assistant" } sender
     * @param { string } message
     * @param { number } time
     */
    constructor(id, patientId, sender, message, time) {
        this.id = id;
        this.patientId = patientId;
        this.sender = sender;
        this.message = message;
        this.time = time;
    }
}

module.exports = ChatHistory;