import fetch from "node-fetch";
import createHttpError from "http-errors";

import RoutesDatabase from "./RoutesDatabase.mjs";
import ParserSVT from "../parsers/ParserSVT.mjs";

export default async (fastify) => {

    fastify.post("/", async (request, reply) => {
        let html, parser, recipe, stream;
        try {
            const response = await fetch(request.body.url);
            if (response.ok) {
                html = await response.text();
            }
        } catch(error) {
            console.log(error);
        }
        
        // From SVT
        if (request.body.url.startsWith("https://www.svt.se")) {
            console.log(request.body.url);
            parser = new ParserSVT(request.body.url, html, "sv-SE");
            await parser.getRecipe();
            stream = await parser.getPicture();
        }
    
        // From Godare
        if (request.body.url.startsWith("https://www.koket.se/")) {

        }

        // From Tasteline
        if (request.body.url.startsWith("https://www.tasteline.com/")) {

        }
    
        // Default
        /*
        if (found === false) {
            document["title"] = doc.head.querySelector("[name~=title][content]").content;
            document["description"] = doc.head.querySelector("[name~=description][content]").content;
        }
        */

        console.log(parser.recipe);
        // Add to database
        try {
            if (parser.recipe) {
                // Add picture
                const resultSavePicture = await fastify.mongo.db.uploadFile(
                    parser.recipe.image,
                    parser.recipe._id.toString(),
                    { id: parser.recipe.image, created: new Date() },
                    stream
                );
                if (resultSavePicture.id) {
                    // Add recipe
                    const resultSaveRecipe = await fastify.mongo.db
                    .collection(`recipe-${parser.language.toLowerCase()}`)
                    .insertOne(parser.recipe);
                    if (resultSaveRecipe.acknowledged && resultSaveRecipe.insertedId === parser.recipe._id) {
                        console.log("recipe is in database");
                        reply.type("application/json");
                        return JSON.stringify(recipe);
                    }
                }
            }
        } catch(error) {
            const strError = fastify.mongo.db.readError(error);
            return createHttpError(500, strError);
        }
    });
}