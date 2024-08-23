import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import jsdom from "jsdom";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const createEmptyObject = (schema) =>  {
    const type = schema.type || schema.bsonType;

    switch (type) {
        case 'object':
            const obj = {};
            if (schema.properties) {
                for (const key in schema.properties) {
                    obj[key] = createEmptyObject(schema.properties[key]);
                }
            }
            return obj;
        case 'array':
            return [];
        case 'string':
            return '';
        case 'number':
        case 'integer':
        case 'double':
            return 0;
        case 'boolean':
            return false;
        case 'null':
            return null;
        case 'date':
            return new Date(0);
        case 'objectId':
            return undefined;
        case 'binary':
            return Buffer.alloc(0);
        case 'decimal':
            return 0.0;
        default:
            return undefined;
    }
}

export default class Parser {

    /**
     * 
     * @param { String } html 
     * @param { String } language -  
     */
    constructor(html, language) {
        this._dom = new jsdom.JSDOM(html);
        this._doc = this._dom.window.document;
        this._language = language.toLowerCase();

        // Path already checked during startup
        const pathComplete = path.join(__dirname, "../../schemas/database");
        this._schema = JSON.parse(readFileSync(path.join(pathComplete, "recipe.json")));
    }

    async getRecipe() {
        return undefined;
    }

    async getPicture(url) {
        return undefined;
    }

    _createEmptyResponse() {
        return createEmptyObject(this._schema);
    }

    

}