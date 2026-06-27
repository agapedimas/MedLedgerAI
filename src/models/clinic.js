class Clinic {
    /**
     * @param { number } id
     * @param { string } name
     * @param { string } address
     * @param { string } phone
     * @param { number } created
     */
    constructor(id, name, address, phone, created) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.created = created;
    }
}

module.exports = Clinic;