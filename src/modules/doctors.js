const Database = require("../database");
const Doctor = require("../models/doctor");

/**
 * @returns { Promise<Array<Doctor>> }
 */
async function getAll() {
    const query = `
        SELECT 
            Account.id AS id, 
            Account.email AS email, 
            Account.fullname AS fullname, 
            Account.pictureId AS pictureId, 
            DoctorProfile.clinicId AS clinicId, 
            Clinic.name AS clinicName, 
            DoctorProfile.specialtyId AS specialtyId, 
            Specialty.name AS specialtyName, 
            DoctorProfile.experienceYears AS experienceYears
        FROM DoctorProfile
        JOIN Account ON Account.id = DoctorProfile.accountId
        JOIN Clinic ON Clinic.id = DoctorProfile.clinicId
        JOIN Specialty ON Specialty.id = DoctorProfile.specialtyId
    `;
    const results = await Database.doQuery(query);
    return results.data?.map(o => Object.assign(new Doctor(), o)) || [];
}

module.exports = {
    getAll
};