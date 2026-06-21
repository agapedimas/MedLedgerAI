class Consent {
    /**
     * @param { number } id
     * @param { string } patientId
     * @param { string } doctorId
     * @param { "pending" | "granted" | "revoked" } status
     * @param { number } updated
     */
    constructor(id, patientId, doctorId, status, updated) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.status = status;
        this.updated = updated;
    }
}

module.exports = Consent;