import { default as envSchema } from "env-schema";

export default function readEnvironment(path = ".env") {

    const schema = {
        type: "object",
        properties: {
            SERVER_PORT: {
                type: "number",
                default: 7090,
                description: "Port number on the server"
            },
            PRINT_ROUTES: {
                type: "boolean",
                default: false,
                description: "Will print server routes in logger during startup"
            },
            MONGO_USERNAME: {
                type: "string",
                default: "",
                description: "Username for mongo database"
            },
            MONGO_PASSWORD: {
                type: "string",
                default: "",
                description: "Password for mongo database" 
            },
            MONGO_HOST: {
                type: "string",
                default: "localhost",
                description: "The host for mongo database"
            },
            MONGO_PORT: {
                type: "number",
                default: 27017,
                description: "Port for mongo database"
            },
            MONGO_DATABASE: {
                type: "string",
                description: "Name of mongo database"
            },
            MONGO_AUTH: {
                type: "string",
                default: "admin",
                description: "Database which store administration rights/permissions in mongo"
            },
            MONGO_FAMILY: {
                type: "integer",
                default: 4,
                enum: [ 4, 6 ],
                description: "Database client should connect under ipv4 or ipv6"
            }
        }
    }

    return envSchema({ schema, dotenv: { path }});
}