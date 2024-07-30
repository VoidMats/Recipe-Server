import { ObjectId } from "mongodb";

import Parser from "./Parser.mjs";

export default class ParserSVT extends Parser {

    constructor(html) {
        super(html);
    }

    async getRecipe() {
        try {
            // Check if url is a valid SVT recipe url
            const head = this._doc.head.querySelector('meta[property="og:site_name"][content="SVT recept"]');
            if (!head) throw new Error(`The url does not contain any recipe from the SVT site`);

            const recipe = { _id: new ObjectId() };

            // Title, description etc..
            recipe["title"] = this._doc.head.querySelector("[name~=title][content]").content;
            recipe["description"] = this._doc.head.querySelector("[name~=description][content]").content;
            const spanTime = this._doc.body.querySelector("span.Recipe_svtmat_recipe__estimateText__4PuMH");
            recipe["time"] = "";
            for (const node of spanTime.childNodes) {
                if (node.textContent) recipe["time"] += node.textContent;
            };

            // Keywords
            const listKeywords = this._doc.body.querySelector("ul.Recipe_svtmat_recipe__tagList__UmBWV");
            recipe["keywords"] = [];
            for (const li of listKeywords.childNodes) {
                recipe.keywords.push(li.firstChild.text);
            };

            // Servings
            const spanServings = this._doc.body.querySelector('span.Recipe_svtmat_recipe__portionsText__g1jgI');
            recipe["servings"] = Number(spanServings.textContent);

            // Components
            recipe["components"] = [];                      
            const listNames = this._doc.body.querySelectorAll('h3[class*="Recipe_svtmat_recipe__ingredientsSubHeader"]');
            const listIngredients = this._doc.body.querySelector('div[class*="Recipe_svtmat_recipe__ingredientsListContainer"]');
            // Remove the first div, because it only contains, servings
            const childNodes = listIngredients.children;
            if (childNodes.length > 0 && childNodes[0].tagName === "DIV") {
                listIngredients.removeChild(childNodes[0]);
            }
            // If there is no sub-headers in components
            // TODO this could be done better
            if (listNames.length === 0) {
                const obj = { 
                    name: recipe.title,
                    ingredients: [] 
                };
                const ul = listIngredients.children[0].children[0];
                for (const li of ul.childNodes) {
                    const portion = {};
                    const size_unit = li.querySelector('span');
                    if (size_unit) {
                        const size = size_unit.firstChild?.nodeValue;
                        portion["size"] = (size) ? size : "";
                        let unit;
                        if (size_unit.length === 2) {
                            unit = size_unit.lastChild?.nodeValue;
                        }
                        portion["unit"] = (unit) ? unit : "";
                    }
                    //const ingredient = li.querySelector('div[class*="Recipe_svtmat_recipe__ingredientsItemCell"]');
                    const ingredient = li.lastChild.textContent;
                    if (size_unit && ingredient) portion["ingredient"] = ingredient;
                    obj.ingredients.push(portion);
                }
                recipe.components.push(obj);
            } else {
                for (const element of listIngredients.children) {
                    if (element.tagName === "H3") {

                    }
                    if (element.tagName === "UL") {
                        for (const li of ul.childNodes) {
                            const portion = {};
                            const size_unit = li.querySelector('span');
                            if (size_unit) {
                                const size = size_unit.firstChild?.nodeValue;
                                portion["size"] = (size) ? size : "";
                                let unit;
                                if (size_unit.length === 2) {
                                    unit = size_unit.lastChild?.nodeValue;
                                }
                                portion["unit"] = (unit) ? unit : "";
                            }
                            const ingredient = li.lastChild.textContent;
                            if (size_unit && ingredient) portion["ingredient"] = ingredient;
                            obj.ingredients.push(portion);
                        }
                    }
                }
                /*
                for (let i=0; i<listNames.length; i++) {
                    const obj = { ingredients: [] };
                    const name = listNames[i].textContent;
                    if (name) obj["name"] = name;
                    const ul = listIngredients.children[i].children[1];
                    for (const li of ul?.childNodes) {
                        const portion = {};
                        const size_unit = li.querySelector('span');
                        if (size_unit) {
                            let size = size_unit.firstChild?.nodeValue;
                            portion["size"] = (size) ? size : "";
                            const unit = size_unit.lastChild?.nodeValue;
                            portion["unit"] = (unit) ? unit : "";
                        }
                        const ingredient = li.lastChild.textContent;
                        if (size_unit && ingredient) portion["ingredient"] = ingredient;
                        obj.ingredients.push(portion);
                    }
                    recipe.components.push(obj);
                };
                */
            }

            // Instructions
            recipe["instructions"] = [{ name: undefined, steps: [] }];
            const listInstructions = this._doc.body.querySelector('div.Recipe_svtmat_recipe__instructionsContainer__oohtS');
            let idx = 0;
            for (const child of listInstructions.childNodes) {
                if (child.nodeName === "H4") {
                    recipe.instructions[idx].name = child.textContent;
                }
                if (child.nodeName === "OL") {
                    for (const li of child.childNodes) {
                        recipe.instructions[idx].steps.push(li.textContent);
                    }
                    // Start a new instruction
                    recipe.instructions.push({ name: undefined, steps: [] });
                    idx++;
                }
            }
            recipe.instructions.pop();
            
            return recipe;
        } catch(error) {
            console.log(error);
            return this._createEmptyResponse();
        }
    }

    async getPicture(url) {
        // Picture
        const divPicture = this._doc.body.querySelector("div.Recipe_svtmat_recipe__mediaContainer__TUDv5");
        const imgPicture = divPicture.querySelector("img");
        console.log(imgPicture.src);
        console.log(url);
        //const urlPicture = new URL(url, imgPicture.src);
        //await _getPicture(urlPicture)
    }
}