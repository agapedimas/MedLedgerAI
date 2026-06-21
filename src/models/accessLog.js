class AccessLog {
    /**
     * @param { number } id
     * @param { number } recordId
     * @param { string } accessedBy
     * @param { string } ipAddress
     * @param { string } action
     * @param { number } time
     */
    constructor(id, recordId, accessedBy, ipAddress, action, time) {
        this.id = id;
        this.recordId = recordId;
        this.accessedBy = accessedBy;
        this.ipAddress = ipAddress;
        this.action = action;
        this.time = time;
    }
}

module.exports = AccessLog;