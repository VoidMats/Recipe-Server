import { fileURLToPath } from "node:url";
import path from "node:path";

import Fastify from "fastify";
import staticRouter from "@fastify/static";
import cors from "@fastify/cors";
import fastifyGracefulShutdown from "fastify-graceful-shutdown";

import { db } from "./plugins/Mongodb.mjs";
import RoutesPages from "./routes/RoutesPages.mjs";
import RoutesDatabase from "./routes/RoutesDatabase.mjs";

import { hasDockerEnv, hasDockerGroup } from  "./general.mjs";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default function createServer(config) {
    console.log("==> Start to create server");

    const SETTING = {
        runningInProduction: process.env.NODE_ENV || "development",
        runningInContainer: hasDockerEnv() || hasDockerGroup(),
        printRoutes: config.PRINT_ROUTES
    };

    const CONFIG = {  //Freeze ??
        logger: true,
        bodyLimit: 1024 * 1024,                                     // 1 mb
        pluginTimeout: 20000,
        trustProxy: (SETTING.runningInProduction) ? true : false    // Will trust X-Forwarded-* headers
    };
    const fastify = Fastify(CONFIG);

    console.log("==> Add content parser")
    fastify.addContentTypeParser("application/octet-stream", (_, payload, done) => {
        done(null, payload);
    });

    console.log("==> Register decorators");
    fastify.decorate("config", Object.assign(CONFIG, config));

    console.log("==> Register plugins");
    fastify.register(fastifyGracefulShutdown);
    fastify.register(db, config);
    fastify.register(cors, { 
        origin: true
    });

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

    console.log("==> Register hooks");
    fastify.after(() => {
        fastify.gracefulShutdown((signal, next) => {
            console.log(`==> Received signal to shutdown: ${signal}`);
            next();
        });
    });

    fastify.addHook("onReady", async () => {
        console.log("==> Server is ready...");

        if (SETTING.printRoutes) {
            console.log("=== Print routes ===");
            console.log(fastify.printRoutes());
            console.log("====================");
        }
    });

    console.log("==> Register routes");
    fastify.register(RoutesPages, { prefix: "/v1/parse"});

    return fastify;
}