const fs = require("fs");
const path = require("path");

const Hash = require("../utils/hash");
const Image = require("../utils/image");
const Database = require("../database");
const Account = require("../models/account");

const pictureFolderPath = path.resolve(__dirname, "../../data/pp");

/**
 * @returns { Promise<Array<Account>> }
 */
async function getAll() {
    const results = await Database.doQuery("SELECT * FROM AccountView");
    return results.data?.map(o => Object.assign(new Account(), o)) || [];
}

/**
 * @param { typeof Account.prototype.id } accountId
 * @returns { Promise<Account?> }
 */
async function getByAccountId(accountId) {
    const results = await Database.doQuery("SELECT * FROM AccountView WHERE id = ?", accountId);
    const data = results.data?.at(0);
    if (data)
        return Object.assign(new Account(), data);
    else
        return null;
}

/**
 * @param { string } authenticationId
 * @returns { Promise<Account?> }
 */
async function getByAuthenticationId(authenticationId) {
    if (authenticationId == null)
        return null;
    
    const results = 
        await Database.doQuery(`
            SELECT AccountView.* FROM AccountView 
            JOIN
                Authentication ON 
                    Authentication.accountId = AccountView.id AND
                    Authentication.id = ?;
        `, authenticationId);

    const data = results.data?.at(0);
    if (data)
        return Object.assign(new Account(), data);
    else
        return null;
}

/**
 * @param { typeof Account.prototype.email } email
 * @returns { Promise<Account?> }
 */
async function getByEmail(email) {
    const results = await Database.doQuery("SELECT * FROM AccountView WHERE email = ?", email);
    const data = results.data?.at(0);
    if (data)
        return Object.assign(new Account(), data);
    else
        return null;
}

/**
 * @param { typeof Account.prototype.email } email 
 * @param { typeof Account.prototype.fullname } fullname 
 * @param { string } password 
 * @param { typeof Account.prototype.role } role
 * @returns { Promise<typeof Account.prototype.id> } Account id
 */
async function add(email, fullname, password, role) {
    const id = Hash.generateUniqueId(email);
    password = await Hash.toHashString(password);

    const result = 
        await Database.doQuery(`
            INSERT INTO Account (id, email, fullname, password, roleId)
            VALUES (?, ?, ?, ?, (SELECT id FROM Role WHERE name=?))
        `, 
        [id, email, fullname, password, role]);

    return id;
}

/**
 * 
 * @param { typeof Account.prototype.id } accountId 
 * @param { typeof Account.prototype.email? } email 
 * @param { typeof Account.prototype.fullname? } fullname 
 * @param { string? } password 
 * @param { typeof Account.prototype.role? } role
 * @param { typeof Account.prototype.pictureId? } pictureId 
 * @returns { Promise<boolean> }
 */
async function update(accountId, email, fullname, password, role, pictureId) {
    if (password)
        password = Hash.toHashString(password);

    const pictureIdParam = pictureId === "@NULL" ? null : pictureId;

    const result =
        await Database.doQuery(`
            UPDATE Account
            SET
                email = COALESCE(?, email),
                fullname = COALESCE(?, fullname),
                password = COALESCE(?, password),
                roleId = COALESCE((SELECT id FROM Role WHERE name = ?), roleId),
                pictureId = ${ pictureId === "@NULL" ? "?" : "COALESCE(?, pictureId)" }
            WHERE
                id = ?
        `, 
        [email, fullname, password, role, pictureIdParam, accountId]);

    return result.isSuccess;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<boolean> }
 */
async function remove(accountId) {
    await removePicture(accountId);
    const result = await Database.doQuery("DELETE FROM Account WHERE id = ?", accountId);
    return result.success;
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<typeof Account.prototype.pictureId> }
 */
async function getPictureId(accountId) {
    const account = await getByAccountId(accountId);
    return account.pictureId;
}
async function getPicture(accountId) {
    
}
/**
 * @param { typeof Account.prototype.id } accountId 
 * @param { Array<Buffer> } buffer 
 * @returns { Promise<void> }
 */
async function setPicture(accountId, buffer) {
    const newPictureId = Hash.generateUniqueId(accountId);

    // Save to disk
    await Image.saveBufferToImageFile(
        buffer, newPictureId, pictureFolderPath, { 
            width: 720, 
            height: 720, 
            horizontalAlignment: "center", 
            verticalAlignment: "center"
        });

    // Remove old picture
    await removePicture(accountId);
    await update(accountId, null, null, null, null, newPictureId);
}

/**
 * @param { typeof Account.prototype.id } accountId 
 * @returns { Promise<void> }
 */
async function removePicture(accountId) {
    // Remove old picture if exists
    const oldPictureId = await getPictureId(accountId);
    if (oldPictureId && fs.existsSync(pictureFolderPath + oldPictureId))
        fs.unlinkSync(pictureFolderPath + oldPictureId);
    
    // Update database
    await update(accountId, null, null, null, null, "@NULL");
}

module.exports = {
    getAll, getByAccountId, getByAuthenticationId, getByEmail,
    add, update, remove,
    getPictureId, setPicture, removePicture
};