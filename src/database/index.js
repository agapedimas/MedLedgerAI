const fs = require("fs");
const mySql = require("mysql2");

const tableFolderPath = "./src/database/tables/";
const tableFiles = 
    fs
        .readdirSync(tableFolderPath)
        .filter(o => o.endsWith(".sql"))
        .sort((a,b) => a - b);

/** @type { mySql.Pool } */
let pool;

/**
 * Initializes database connection and table definitions
 * @returns { Promise<void> }
 */
function initialize() {
    return new Promise(async function(resolve) {
        pool = mySql.createPool({
            connectionLimit: 10,
            host: "localhost",
            port: 3306,
            user: process.env.SQL_USERNAME,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            charset: "utf8mb4",
            multipleStatements: true,
            typeCast: function(field, next)
            {
                if (field.type == "JSON") 
                    return JSON.parse(field.string("utf8"));
                
                return next();
            }
        });

        for (const tableFileName of tableFiles) {
            const tableFileContent = fs.readFileSync(tableFolderPath + tableFileName, { encoding: "utf-8" });

            const queries = 
                tableFileContent
                    .split(/(?<!\\);/g)
                    .map((o) => o.replace(/\\;/g, ";").trim())
                    .filter((o) => o != "");

            for (const query of queries) {
                const result = await doQuery(query);
                if (result.isSuccess == false)
                    break;
            }
        }

        resolve();
    });
}

function getPool() {
    return pool;
}

/**
 * 
 * @param { string } query 
 * @param { string | Array<string> } values 
 * @returns { Promise<{
 *      isSuccess: boolean,
 *      data: Array<object> | { 
 *          affectedRows: number,
 *          changedRows: number,
 *          fieldCount: number,
 *          insertId: any,
 *          message: string
 *      }
 * }> }
 */
function doQuery(query, values) {
    return new Promise(function(resolve) {
        pool.createQuery(query, values, function(error, results) {
            if (error) {
                const errorObject = JSON.parse(JSON.stringify(error));
                console.error(error.message, errorObject);

                return resolve({
                    isSuccess: false,
                    data: null
                });
            }

            return resolve({
                isSuccess: true,
                data: 
                    results.constructor.name == "RowPacket" 
                    ? (results.length > 0 ? results : null) : results 
            });
        });
    });
}

module.exports = { initialize, getPool, doQuery };