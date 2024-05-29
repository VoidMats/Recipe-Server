import { fileURLToPath } from "node:url";
import path from "node:path";

import Fastify from "fastify";
import staticRouter from "@fastify/static";

import { hasDockerEnv, hasDockerGroup } from  "./general.mjs";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default function createServer(config) {
    console.log("==> Start to create server");

    const SETTING = {
        runningInProduction: process.env.NODE_ENV || "development",
        runningInContainer: hasDockerEnv() || hasDockerGroup(),
    };

    const DATABASES = {};
    // Check if there are environment variables for mongodb

    // Check if there are environment variables for postgres

    // There are no environment variables for databases. Use sqlite3
    if (!Object.keys(DATABASES).length) {

    }

    const CONFIG = {
        logger: false,
        bodyLimit: 1024 * 1024,                                     // 1 mb
        pluginTimeout: 20000,
        trustProxy: (SETTING.runningInProduction) ? true : false    // Will trust X-Forwarded-* headers
    };
    const fastify = Fastify(Object.assign(CONFIG, config));

    console.log("==> Register decorators");
    fastify.decorate("setting", SETTING);

    console.log("==> Register plugins");
    fastify.register(staticRouter, {
        root: path.join(__dirname, "../build"),
        prefix: "/",
        wildcard: false
    });
    fastify.register(staticRouter, {
        root: path.join(__dirname, "../public"),
        prefix: "/public",
        decorateReply: false
    });

    console.log("==> Register routes");

    return fastify;
}