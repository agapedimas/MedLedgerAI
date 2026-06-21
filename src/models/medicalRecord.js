class MedicalRecord {
    /**
     * @param { number } id
     * @param { string } patientId
     * @param { string } doctorId
     * @param { string } title
     * @param { string } fileUrl
     * @param { string? } aiSummary
     * @param { string? } blockchainHash
     * @param { number } created
     */
    constructor(id, patientId, doctorId, title, fileUrl, aiSummary, blockchainHash, created) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.title = title;
        this.fileUrl = fileUrl;
        this.aiSummary = aiSummary;
        this.blockchainHash = blockchainHash;
        this.created = created;
    }
}

module.exports = MedicalRecord;