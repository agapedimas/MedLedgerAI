const Database = require("../database");
const Clinic = require("../models/clinic");

/**
 * @returns { Promise<Array<Clinic>> }
 */
async function getAll() {
    const results = await Database.doQuery("SELECT * FROM Clinic");
    return results.data?.map(o => Object.assign(new Clinic(), o)) || [];
}

module.exports = {
    getAll
};