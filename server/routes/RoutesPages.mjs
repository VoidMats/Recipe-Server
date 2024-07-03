import jsdom from "jsdom";
import fetch from "node-fetch";
import { ObjectId } from "mongodb";

export default async (fastify) => {

    fastify.post("/", async (request) => {
        const body = request.body;
        console.log(body);

        let html, doc, answer;
        try {
            const response = await fetch(request.body.url); 
            if (response.ok) {
                html = await response.text();
            }
        } catch(error) {
            console.log(error);
        }

        const dom = new jsdom.JSDOM(html);
        doc = dom.window.document;

        let found = false;
        const document = { _id: new ObjectId() };
        
        // From SVT
        const svt = doc.head.querySelector('meta[property="og:site_name"][content="SVT recept"]');
        if (svt) {
            found = _getSVTrecipe(document, doc);
        }

        // From another site
    
        // Default
        if (found === false) {
            document["title"] = doc.head.querySelector("[name~=title][content]").content;
            document["description"] = doc.head.querySelector("[name~=description][content]").content;
        }

        console.log(document);

        // Add to database
        try {
            await fastify.mongo.db.collection("recipe").insertOne(document);
        } catch(error) {
            return createHttpError(500, error);
        }
    });

    // Private methods

    const _getSVTrecipe = (document, doc) => {
        try {
            // Title, description etc..
            document["title"] = doc.head.querySelector("[name~=title][content]").content;
            document["description"] = doc.head.querySelector("[name~=description][content]").content;
            const spanTime = doc.body.querySelector("span.Recipe_svtmat_recipe__estimateText__4PuMH");
            document["time"] = "";
            for (const node of spanTime.childNodes) {
                if (node.textContent) document["time"] += node.textContent;
            }
            // Keywords
            const listKeywords = doc.body.querySelector("ul.Recipe_svtmat_recipe__tagList__UmBWV");
            document["keywords"] = [];
            for (const li of listKeywords.childNodes) {
                document.keywords.push(li.firstChild.text);
            }
            // Servings
            const spanServings = doc.body.querySelector('span.Recipe_svtmat_recipe__portionsText__g1jgI');
            document["servings"] = Number(spanServings.textContent);
            // Components
            document["components"] = [];
            const listNames = doc.body.querySelectorAll('h3.Recipe_svtmat_recipe__ingredientsSubHeader__HvsWu');
            const listIngredients = doc.body.querySelector('div.Recipe_svtmat_recipe__ingredientsListContainer__7D03w');
            const childNodes = listIngredients.children;
            if (childNodes.length > 0 && childNodes[0].tagName === 'DIV') {
                listIngredients.removeChild(childNodes[0]);
            }
            for (let i=0; i<listNames.length; i++) {
                const obj = { ingredients: [] };
                const name = listNames[i].textContent;
                if (name) obj["name"] = name;
                const ul = listIngredients.children[i].children[1];
                for (const li of ul.childNodes) {
                    const portion = {};
                    const size_unit = li.querySelector('span');
                    if (size_unit) {
                        const size = size_unit.firstChild?.nodeValue;
                        portion["size"] = (size) ? size : "";
                        const unit = size_unit.lastChild?.nodeValue;
                        portion["unit"] = (unit) ? unit : "";
                    }
                    const ingredient = li.lastChild.textContent;
                    if (size_unit && ingredient) portion["ingredient"] = ingredient;
                    obj.ingredients.push(portion);
                }
                document.components.push(obj);
            };
            // Instructions
            document["instructions"] = [{ name: "Så lagar du", step: [] }];
            const listInstructions = doc.body.querySelector('div.Recipe_svtmat_recipe__instructionsContainer__oohtS');
            for (const li of listInstructions.firstChild.childNodes) {
                document.instructions[0].step.push(li.textContent);
            }

            // Set 'found' to high, not trigger default 
            return true;
        } catch(error) {
            console.log(error);
        }
    }

    const _createDatabaseDocument = (document) => {
        // Validate with ajv

        // Load to database
        
    }
}