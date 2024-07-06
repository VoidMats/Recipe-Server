import pkg from 'http-errors';
import { ObjectId } from "mongodb";

const { httpError } = pkg;

// Move this to decorate
import { __FILE_BUCKET_NAME } from "../plugins/Mongodb.mjs";
import createHttpError from 'http-errors';

export default async (fastify) => {

    const _validateObjectId = (id) => {
        return (ObjectId.isValid(id)) ? id : ObjectId(id);
    }

    const _createAnswer = (success = false, result, error) => {
        const answer = { 
            timestamp: new Date().toLocaleDateString(), 
            success: success,
            result: undefined,
            code: undefined,
            error: undefined  
        };
        if (result) {
            answer.result = result;
            answer.code = 200;
            answer.error = "No error";
        }
        if (error) {
            answer.code = error.statusCode;
            answer.error = `${error.code} - ${error.message}`;
        }
        return answer;
    }

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
            let metadata = { id, created: new Date() };
            try {
                metadata = JSON.parse(request.query.metadata ?? "{}");
            } catch (error) {
                return reject(httpError(400, `Invalid metadata: ${error}`));
            }
            // Upload file to filebucket
            const stream = await fastify.mongo.fileBucket.openUploadStream(filename, { metadata });
            stream.on("error", async (error) => {
                console.error(`GridFS upload stream failed. Calling abort to delete chunks. (reason: ${error})`);
                try {
                    await stream.abort();
                } catch (abortError) {
                    console.error(`Abort failed: ${error}`);
                }
                return reject(error);
            });
            stream.on("finish", async (object) => {
                try {
                    await fastify.mongo.db.collection(`${__FILE_BUCKET_NAME}.files`).updateOne(
                        { _id: object._id },
                        {
                            $set: {
                                "metadata.id": id,
                            },
                        },
                    );
                    resolve({ id });
                } catch (error) {
                    console.error(`Error updating metadata for file ${id}: ${error}`);
                    console.error(error);
                    return reject(httpError(500, error));
                }
            });
            request.body.pipe(stream);
        });
    };

    fastify.post("/file", async (request) => {
        const id = new ObjectId();
        return handleUploadFile(id, request);
    });

    fastify.get("/file/:id", async (request) => {
        const id = _validateObjectId(request.params.id);
        const file = await fastify.mongo.db
            .collection(`${__FILE_BUCKET_NAME}.files`)
            .findOne({ "metadata.id": id });
        if (!file) {
            throw httpError(404, `File ${id} not found`);
        }
        return file;
    });

    fastify.get("/file/:id/download", async (request) => {
        const id = _validateObjectId(request.params.id);
        const file = await fastify.mongo.db
            .collection(`${__FILE_BUCKET_NAME}.files`)
            .findOne({ "metadata.id": id });
        if (!file) {
            throw httpError(404, `File ${id} not found`);
        }
        return fastify.mongo.fileBucket.openDownloadStream(file._id);
    });

    // Recipe routes

    /**
     * 
     * @returns { { acknowleged, insertedId } } 
     */
    fastify.post("/recipe", async (request) => {
        const document = request.body;
        document._id = _validateObjectId(document._id);
        try {
            const dbAnswer = await fastify.mongo.db.collection("recipe").insertOne(document);
            return _createAnswer(true, dbAnswer);
        } catch(error) {
            return createHttpError(500, error);
        }
    });

    fastify.get("/recipe/:id", async (request) => {
        const id = _validateObjectId(request.params.id);
        const recipe = await fastify.mongo.db.collection("recipe").findOne({ _id: id });
        if (!recipe) {
            const error = createHttpError(404, `Recipe ${id} not found`);
            return _createAnswer(false, undefined, error);
        }
        return _createAnswer(true, recipe);
    });


    fastify.get("/recipe/search", async (request) => {
        const { text } = request.query;
        const query = { title: { "$regex": `^${text}` } };

        try {
            const recipes = await fastify.mongo.db.collection("recipe").find(query).toArray();
            return _createAnswer(true, recipes);
        } catch(error) {
            console.error(error);
            // TODO best would be to use the database plugin return http response
            return createHttpError(500, error);
        }
    });

};
