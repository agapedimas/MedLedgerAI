const Account = require("./account");

class Doctor extends Account {
    /**
     * @param { number } clinicId
     * @param { string } clinicName
     * @param { number } specialtyId
     * @param { string } specialtyName
     * @param { number } experienceYears
     */
    constructor(id, email, fullname, created, pictureId, clinicId, clinicName, specialtyId, specialtyName, experienceYears) {
        super(id, email, fullname, created, "doctor", pictureId)
        this.id = id;
        this.email = email;
        this.fullname = fullname;
        this.pictureId = pictureId;
        this.clinicId = clinicId;
        this.clinicName = clinicName;
        this.specialtyId = specialtyId;
        this.specialtyName = specialtyName;
        this.experienceYears = experienceYears;
    }
}

module.exports = Doctor;