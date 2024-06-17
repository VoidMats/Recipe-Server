import createServer from "./server/createServer.mjs";
import readEnvironment from "./server/readEnvironment.mjs"

const start = async () => {
    const config = readEnvironment();
    const fastify = createServer(config);

    fastify.listen({ port: config.SERVER_PORT, host: "0.0.0.0" }, async (error, address) => {
        if (error) {
            console.error(error);
            fastify.close();
        }
        console.log(`    Server is listening on ${address}`);
    });
};

start();