class Account {
    /**
     * @param { string } id
     * @param { string } email
     * @param { string } fullname
     * @param { number } created
     * @param { "doctor" | "patient" } role
     * @param { string? } pictureId
     */
    constructor(id, email, fullname, created, role, pictureId) {
        this.id = id;
        this.email = email;
        this.fullname = fullname;
        this.created = created;
        this.role = role;
        this.pictureId = pictureId;
    }
}

module.exports = Account;