const Database = require("../database");
const Account = require("../models/account");
const Authentication = require("../models/authentication");
const Hash = require("../utils/hash");

/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof Authentication.prototype.ipAddress } ipAddress 
 * @returns { Promise<typeof Authentication.prototype.id> } Authentication id
 */
async function add(accountId, ipAddress) {
    const result = 
        await Database.doQuery(`
            INSERT INTO Authentication (accountId, ipAddress)
            VALUES (?,?)
        `, [accountId, ipAddress]);
    return result.data?.insertId;
}

/**
 * @param { typeof Authentication.prototype.id } authenticationId 
 * @returns { Promise<void> }
 */
async function remove(authenticationId) {
    await Database.doQuery("DELETE FROM Authentication WHERE id = ?", authenticationId);
}

/**
 * Check if account has access
 * @param { typeof Authentication.prototype.id } authenticationId 
 * @param { Array<typeof Account.prototype.role> } allowedRoles 
 * @returns { Promise<boolean> }
 */
async function checkAccess(authenticationId, allowedRoles) {
    let query;
    let params = [];

    if (allowedRoles) {
        if (typeof allowedRoles === "string")
            allowedRoles = [allowedRoles];

        query = `
            SELECT 
                Authentication.id
            FROM
                Authentication
            JOIN
                Account ON Account.id = Authentication.accountId
            JOIN
                Role ON Role.id = Account.roleId
            WHERE
                Authentication.id = ?
        `;
        params.push(authenticationId);
        
        const roleQueries = [];
        for (const role of allowedRoles) {
            roleQueries.push("?");
            params.push(role);
        }

        query += " AND Role.name IN (" + roleQueries.join(",") + ")";
    }
    else {
        query = "SELECT id FROM authentication WHERE id=?";
        params.push(authenticationId);
    }

    query += " LIMIT 1";
    const results = await Database.doQuery(query, params);
    return results.data?.length > 0;
}

/**
 * @param { string } email 
 * @param { string } password 
 * @returns { Promise<boolean> }
 */
async function checkCredentials(email, password) {
    // Get password from database
    const result = await Database.doQuery("SELECT password FROM Account WHERE email=?", email);
    
    if (result.isSuccess == false || !result.data?.at(0))
        return false;

    const hashedPasswordWithSalt = result.data[0].password;
    return await Hash.isMatch(password, hashedPasswordWithSalt);
}

module.exports = {
    add, remove,
    checkAccess, checkCredentials
};