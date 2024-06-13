import { ObjectId } from "mongodb";

import { __FILE_BUCKET_NAME } from "../plugins/Mongodb.mjs";

export default async (fastify) => {

    const handleUploadFile = async (id, request) => {
        return new Promise(async (resolve, reject) => {
            const filename = request.query.filename;
            if (!filename) {
                return reject(httpError(400, `filename is missing from query`));
            }
            // Check for existing file
            const existingFile = await fastify.mongo.db
                .collection(`${__FILE_BUCKET_NAME}.files`)
                .findOne({ "metadata.id": id });
            if (existingFile) {
                return reject(httpError(403, `A file with id ${id} already exists.`));
            }
            // Add new file
            let metadata;
            try {
                metadata = JSON.parse(request.query.metadata ?? "{}");
            } catch (error) {
                return reject(httpError(400, `Invalid metadata: ${error}`));
            }
            for (const key in metadata) {
                if (key === "__foran") {
                    return reject(httpError(400, `metadata cannot contain the key "__foran"`));
                }
            }
            const now = new Date();
            metadata.__foran = {
                created: now,
                createdBy: new ObjectId(request.userId),
            };
            const stream = await fastify.mongo.fileBucket.openUploadStream(filename, { metadata });
            stream.on("error", async (error) => {
                console.log(
                    `GridFS upload stream failed. Calling abort to delete chunks. (reason: ${error})`,
                );
                try {
                    await stream.abort();
                } catch (abortError) {
                    console.error(`Abort failed: ${error}`);
                }
                return reject(error);
            });
            stream.on("finish", async (object) => {
                try {
                    await fastify.mongo.db.collection(`${FILE_BUCKET_NAME}.files`).updateOne(
                        { _id: object._id },
                        {
                            $set: {
                                "metadata.__foran.id": id,
                            },
                        },
                    );
                    resolve({ id });
                } catch (error) /* istanbul ignore next: This should only happen if the connection
                                   to the database dies or something similar. Hard to test. */ {
                    console.error(`Error updating metadata for file ${id}: ${error}`);
                    console.error(error);
                    return reject(httpError(500, error));
                }
            });
            request.body.pipe(stream);
        });
    };

    fastify.post("/files", async (request) => {
        const id = new ObjectId();
        return handleUploadFile(id, request);
    });

    fastify.post("/files/:id", async (request) => {
        const id = getObjectId(request.params.id);
        return handleUploadFile(id, request);
    });

    fastify.get("/files/:id", async (request) => {
        const id = getObjectId(request.params.id);
        const file = await fastify.mongo.db
            .collection(`${FILE_BUCKET_NAME}.files`)
            .findOne({ "metadata.__foran.id": id });
        if (!file) {
            throw httpError(404, `File ${id} not found`);
        }
        return file;
    });

    fastify.get("/files/:id/download", async (request) => {
        const id = getObjectId(request.params.id);
        const file = await fastify.mongo.db
            .collection(`${FILE_BUCKET_NAME}.files`)
            .findOne({ "metadata.__foran.id": id });
        if (!file) {
            throw httpError(404, `File ${id} not found`);
        }
        return fastify.mongo.fileBucket.openDownloadStream(file._id);
    });
};
