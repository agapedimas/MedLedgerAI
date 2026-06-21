class Authentication {
    /**
     * @param { number } id
     * @param { string } accountId
     * @param { string } ipAddress
     * @param { number } time
     */
    constructor(id, accountId, ipAddress, time) {
        this.id = id;
        this.accountId = accountId;
        this.ipAddress = ipAddress;
        this.time = time;
    }
}

module.exports = Authentication;