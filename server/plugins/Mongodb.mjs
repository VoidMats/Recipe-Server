import { promises, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import fastifyPlugin from "fastify-plugin";
import { MongoClient, MongoError, GridFSBucket } from "mongodb";
import mongodbURI from "mongodb-uri";

// TODO Move this to decorate
const __FILE_BUCKET_NAME = "__image_filebucket";
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const db = fastifyPlugin(
    async(fastify, config) => {
        const uri = {
            username: config.MONGO_USERNAME,
            password: config.MONGO_PASSWORD,
            hosts: [
                {
                    host: config.MONGO_HOST,
                    port: config.MONGO_PORT
                }
            ],
            database: config.MONGO_DATABASE,
            options: {
                authSource: config.MONGO_AUTH
            }
        }
        const url = mongodbURI.format(uri);
        const options = {
            family: config.MONGO_FAMILY
        };

        const client = new MongoClient(url, options);
        await client.connect();
        const db = client.db();
        const info = await db.command({ whatsmyuri: 1});
        console.log(`  - Connect to mongodb '${db.databaseName}' on ip: ${info.you}, status: ${(info.ok) ? "true" : "false"}`);

        // Add schemas 
        const pathComplete = path.join(__dirname, "../../schemas/database");
        if (!existsSync(pathComplete)) {
            console.error("Path/Folder for schemas does not exist");
            process.exit(2);
        };
        const pathSchemas = await promises.readdir(pathComplete);
    
        let fileBucket;
        for (const pathSchema of pathSchemas) {
            let name = path.basename(pathSchema).split(".")[0];
            const schema = JSON.parse(readFileSync(path.join(pathComplete, pathSchema)));
            
            // Check for filebucket
            if (name === "file") {
                name = `${__FILE_BUCKET_NAME}.files`;
                fileBucket = new GridFSBucket(db, { bucketName: __FILE_BUCKET_NAME });
            }

            // Add collection to database if missing
            try {
                await db.command({ collMod: name, validator: { $jsonSchema: schema }});
            } catch(error) {
                // 26 === "ns not found" - collection doesn't exist
                if (error instanceof MongoError && error.code === 26) {
                    console.log(`  - Collection '${name}' does not exist and will be created`)
                    await db.createCollection(name, {
                        validator: { $jsonSchema: schema },
                    });
                } else {
                    console.error(error);
                    process.exit(2);
                }
            }
        }
        
        console.log("  - All database schemas was read from folder");

        console.log("  - Add methods to db");
        db.readError = (error) => {
            return error.errorResponse;
        }

        fastify.addHook("onClose", () => {
            console.log("==> Closing database")
            client.close()
        });

        fastify.decorate("mongo", { db, client, fileBucket });
    },
    {
        name: "mongo"
    }
)

export {
    __FILE_BUCKET_NAME,
    db
}