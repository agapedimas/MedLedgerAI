const fs = require("fs");
const path = require("path");

/**
 * Helper to save document buffer to disk
 * @param { Buffer } buffer 
 * @param { string } fileName 
 * @param { string } folderPath 
 * @returns { Promise<string> } Saved file name
 */
async function saveBufferToDisk(buffer, fileName, folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
    
    const fullPath = path.join(folderPath, fileName);
    await fs.promises.writeFile(fullPath, buffer);
    return fileName;
}

module.exports = {
    saveBufferToDisk
};