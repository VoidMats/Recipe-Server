import jsdom from "jsdom";
import fetch from "node-fetch";
import { ObjectId } from "mongodb";
import createHttpError from "http-errors";

import RoutesDatabase from "./RoutesDatabase.mjs";
import ParserSVT from "../parsers/ParserSVT.mjs";

export default async (fastify) => {

    fastify.post("/", async (request, reply) => {

        let html, parser, recipe;
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
            parser = new ParserSVT(html);
            recipe = await parser.getRecipe();
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

        console.log(recipe);
        // Add to database
        try {
            const resultSaveDatabase = await fastify.mongo.db.collection("recipe").insertOne(recipe);
            if (resultSaveDatabase.acknowledged && resultSaveDatabase.insertedId === recipe._id) {
                console.log("recipe is in database");
                reply.type("application/json");
                return JSON.stringify(recipe);
            }
        } catch(error) {
            const strError = fastify.mongo.db.readError(error);
            return createHttpError(500, strError);
        }
    });

    const _getPicture = async (url) => {
        // Get picture
        let stream;
        try {
            const response = await fetch(url); 
            if (response.ok) {
                stream = response.body;
            }
        } catch(error) {
            console.log(error);
        }
        // Import picture
        try {
            await fastify.mongo.db.collection("file").insertOne(picture);
        } catch(error) {
            return createHttpError(500, error);
        }
    }

    const _createDatabaseDocument = (document) => {
        // Validate with ajv

        // Load to database
        
    }
}