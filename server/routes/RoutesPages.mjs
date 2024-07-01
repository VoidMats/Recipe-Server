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
        try {
            // From SVT
            const svt = doc.head.querySelector('meta[property="og:site_name"][content="SVT recept"]');
            if (svt) {
                document["title"] = doc.head.querySelector("[name~=title][content]").content;
                document["description"] = doc.head.querySelector("[name~=description][content]").content;
                const spanTime = doc.body.querySelector("span.Recipe_svtmat_recipe__estimateText__4PuMH");
                for (const node of spanTime.childNodes) {
                    if (node.textContent) document["time"] += node.textContent;
                }
                // keywords
                const listKeywords = doc.body.querySelector("ul.Recipe_svtmat_recipe__tagList__UmBWV");
                document["keywords"] = [];
                for (const li of listKeywords.childNodes) {
                    document.keywords.push(li.firstChild.text);
                }
                // servings
                const spanServings = doc.body.querySelector('span.Recipe_svtmat_recipe__portionsText__g1jgI');
                document["servings"] = spanServings.textContent;
                // components
                document["components"] = [];
                const listIngredients = doc.body.querySelectorAll('ul.Recipe_svtmat_recipe__ingredientsList__b_IqW');
                const listNames = doc.body.querySelectorAll('h3.Recipe_svtmat_recipe__ingredientsSubHeader__HvsWu');
                for (let i=0; i<listNames.length; i++) {
                    const obj = { ingredients: {} };
                    const name = listNames[i].textContent;
                    if (name) obj["name"] = name;
                    console.log(name);
                    for (const li of listIngredients.childNodes) {
                        console.log(li);
                    }
                };
                // Set 'found' to high, to not trigger default 
                found = true;
            }
    
            // From another site
    
            // Default
            if (found === false) {
                document["title"] = doc.head.querySelector("[name~=title][content]").content;
                document["description"] = doc.head.querySelector("[name~=description][content]").content;
            }
        } catch(error) {
            console.log(error);
        }
        console.log(document);
    });

    // Private methods
    const _get = () => {

    }

    const createDatabase = () => {

    }
}