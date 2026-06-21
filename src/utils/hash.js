const crypto = require("crypto");

/**
 * Convert raw string to hashed string
 * @param { string } rawString
 * @param { string? } salt Optional, will be generated automatically if not specified.
 * @returns { Promise<string> } Hashed string
 */
function toHashString(rawString, salt) {
    return new Promise((resolve, reject) => {
        if (salt == null)
            // Generate 16-byte salt
            salt = crypto.randomBytes(16).toString("hex");
        // Hash raw string using scrypt with 64-byte length key
        crypto.scrypt(rawString, salt, 64, function(err, derivedKey) {
            if (err) 
                return reject(err);
            // Return the concatenatation of salt and hash, separated by a colon
            return resolve(salt + ":" + derivedKey.toString("hex"));
        });
    });
}

/**
 * Match between raw string and hashed string
 * @param { string } rawString 
 * @param { string } hashedStringWithSalt 
 * @param { string } salt 
 * @returns { Promise<boolean> } Match result
 */
async function isMatch(rawString, hashedStringWithSalt) {
    const [salt, hashedDatabaseString] = hashedStringWithSalt.split(":");
    const hashedInputString = await toHashString(rawString, salt);
    return hashedInputString == hashedStringWithSalt; 
}

/**
 * Generate unique id based on string using hash algorithm
 * @param { string } rawString 
 * @returns { string }
 */
function generateUniqueId(rawString) {
    rawString = rawString.trim() + Date.now();
    const derivedKey = 
        crypto.createHash("sha256")
            .update(rawString)
            .digest("base64")
            .replace(/[^a-zA-Z0-9]/g, "")
            .substring(0, 10);
    return derivedKey;
}

module.exports = {
    toHashString,
    isMatch,
    generateUniqueId
};