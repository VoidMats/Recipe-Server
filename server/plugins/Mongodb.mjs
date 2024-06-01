import { promises, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import fastifyPlugin from "fastify-plugin";
import { MongoClient, MongoError } from "mongodb";
import mongodbURI from "mongodb-uri";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default fastifyPlugin(
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
            database: config.MONGO_NAME,
            options: {
                authSource: config.MONGO_AUTH
            }
        }
        const setting = {
            url: mongodbURI.format(uri),
            options: {
                family: (config.MONGO_FAMILY) ? config.MONGO_FAMILY : 4
            },
            collections: new Map()
        }

        const client = new MongoClient(setting.url, setting.options);
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
        try {
            for (const pathSchema of pathSchemas) {
                const name = path.basename(pathSchema).split(".")[0];
                const schema = JSON.parse(readFileSync(path.join(pathComplete, pathSchema)));
                setting.collections.set(name, schema);
            }
        } catch(error) {
            console.error(error);
            process.exit(2);
        }
        // Add collections to databases if missing
        for (const [name, schema] of setting.collections) {
            try {
                await this._db.command({ collMod: name, validator: { $jsonSchema: schema }});
            } catch(error) {
                // 26 === "ns not found" - collection doesn't exist
                if (error instanceof MongoError && error.code === 26) {
                    console.log(`  - Collection '${name}' does not exist and will be created`)
                    await db.createCollection(name, {
                        validator: { $jsonSchema: schema },
                    });
                } else {
                    throw error;
                }
            }
        }

        console.log("  - All database schemas was read from folder");

        fastify.addHook("onClose", () => client.close());

        fastify.decorate("mongo", { db, client, setting });
    },
    {
        name: "mongo"
    }
)