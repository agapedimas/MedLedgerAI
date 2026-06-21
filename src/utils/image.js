const fs = require("fs");
const { Jimp } = require("jimp");
const WebpConverter = require("webp-converter");
WebpConverter.grant_permission();

/**
 * Save buffer to WEBP file
 * @param { Array<buffer> } buffer 
 * @param { string } fileName
 * @param { string } folderPath
 * @param { {
 *      width: number,
 *      height: number,
 *      horizontalAlignment: "left" | "center" | "right",
 *      verticalAlignment: "top" | "center" | "bottom"
 * }? } resizeOptions
 * @returns { Promise<void> }
 */
function saveBufferToImageFile(buffer, fileName, folderPath, resizeOptions) {
    return new Promise(async function(resolve, reject) {
        try {
            if (folderPath.endsWith("/") === false) {
                folderPath += "/";
            }

            const filePath = folderPath + fileName;
            const tempPngPath = filePath + ".png";

            // Create folder if path does not exist
            if (fs.existsSync(folderPath) === false) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            if (resizeOptions) {
                const { fileTypeFromBuffer } = await import("file-type");
                const fileType = await fileTypeFromBuffer(buffer);
                
                if (fileType.mime === "image/webp") {
                    fs.writeFileSync(filePath, buffer);
                    await WebpConverter.dwebp(filePath, tempPngPath, "-o");
                } 
                else {
                    fs.writeFileSync(tempPngPath, buffer);
                }

                const image = await Jimp.read(tempPngPath);
                const targetW = resizeOptions.width;
                const targetH = resizeOptions.height;

                // 1. Find the highest scale factor to ensure the image covers the entire frame
                const scaleW = targetW / image.width;
                const scaleH = targetH / image.height;
                const scale = Math.max(scaleW, scaleH);

                const newW = Math.round(image.width * scale);
                const newH = Math.round(image.height * scale);

                // Resize image to cover dimensions
                image.resize({ w: newW, h: newH });

                // 2. Calculate crop offset based on alignment
                let cropX = 0;
                const alignH = resizeOptions.horizontalAlignment || "center";
                if (alignH === "center") {
                    cropX = Math.round((newW - targetW) / 2);
                } 
                else if (alignH === "right") {
                    cropX = newW - targetW;
                }
                else {
                    // 'left' defaults to 0
                } 

                let cropY = 0;
                const alignV = resizeOptions.verticalAlignment || "center";
                if (alignV === "center") {
                    cropY = Math.round((newH - targetH) / 2);
                } 
                else if (alignV === "bottom") {
                    cropY = newH - targetH;
                } 
                else {
                    // 'top' defaults to 0
                }

                // Crop the overflowing parts
                image.crop({ x: cropX, y: cropY, w: targetW, h: targetH });
                await image.write(tempPngPath);

            } 
            else {
                fs.writeFileSync(tempPngPath, buffer);
            }

            // Convert the manipulated PNG to final WEBP
            await WebpConverter.cwebp(tempPngPath, filePath);
            
            // Delete temporary PNG file, keep the final WEBP
            if (fs.existsSync(tempPngPath))
                fs.unlinkSync(tempPngPath);

            resolve();
        } 
        catch (error) {
            reject(error);
        }
    });
}

module.exports = { 
    saveBufferToImageFile 
};