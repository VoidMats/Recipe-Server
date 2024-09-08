import fetch from "node-fetch";
import { ObjectId } from "mongodb";

import Parser from "./Parser.mjs";

export default class ParserSVT extends Parser {

    constructor(url, html, language) {
        super(url, html, language);
    }

    async getRecipe() {
        try {
            // Check if url is a valid SVT recipe url
            const head = this._doc.head.querySelector('meta[property="og:site_name"][content="SVT recept"]');
            if (!head) throw new Error(`The url does not contain any recipe from the SVT site`);

            this.recipe = { _id: new ObjectId() };

            // Title, description etc..
            this.recipe["title"] = this._doc.head.querySelector("[name~=title][content]").content;
            this.recipe["description"] = this._doc.head.querySelector("[name~=description][content]").content;
            const spanTime = this._doc.body.querySelector("span.Recipe_svtmat_recipe__estimateText__4PuMH");
            this.recipe["time"] = "";
            for (const node of spanTime.childNodes) {
                if (node.textContent) this.recipe["time"] += node.textContent;
            };

            // Keywords
            const listKeywords = this._doc.body.querySelector("ul.Recipe_svtmat_recipe__tagList__UmBWV");
            this.recipe["keywords"] = [];
            for (const li of listKeywords.childNodes) {
                this.recipe.keywords.push(li.firstChild.text);
            };

            // Servings
            const spanServings = this._doc.body.querySelector('span.Recipe_svtmat_recipe__portionsText__g1jgI');
            this.recipe["servings"] = Number(spanServings.textContent);

            // Components
            this.recipe["components"] = [];                      
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
                const subComponent = { 
                    name: this.recipe.title,
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
                    subComponent.ingredients.push(portion);
                }
                this.recipe.components.push(subComponent);
            } else {
                for (const element of listIngredients.children) {
                    const subComponent = { name : undefined, ingredients: [] };
                    for (const child of element.children) {
                        if (child.tagName === "H3") {
                            subComponent["name"] = child.textContent;
                        }
                        if (child.tagName === "UL") {
                            for (const li of child.children) {
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
                                subComponent["ingredients"].push(portion);
                            }
                        }
                    }
                    this.recipe.components.push(subComponent);
                }
            }

            // Instructions
            this.recipe["instructions"] = [{ name: "Så lagar du", steps: [] }];
            const listInstructions = this._doc.body.querySelector('div.Recipe_svtmat_recipe__instructionsContainer__oohtS');
            let idx = 0;
            for (const child of listInstructions.childNodes) {
                if (child.nodeName === "H4") {
                    this.recipe.instructions[idx].name = child.textContent;
                }
                if (child.nodeName === "OL") {
                    for (const li of child.childNodes) {
                        this.recipe.instructions[idx].steps.push(li.textContent);
                    }
                    // Start a new instruction
                    this.recipe.instructions.push({ name: undefined, steps: [] });
                    idx++;
                }
                // If the instruction contain only one instruction it will be a list of <p> element
                if (child.nodeName === "P") {
                    const text = /^\d+\.(.+)/.exec(child.textContent);
                    if (text && text[1]) {
                        this.recipe.instructions[idx].steps.push(text[1].trim());
                    }
                    if (child.childNodes.length == 1 && child.childNodes[0].nodeName === "STRONG") {
                        // Start a new instruction
                        this.recipe.instructions.push({ name: child.childNodes[0].textContent, steps: [] });
                        idx++;
                    } 
                }
            }
            // hmm
            //this.recipe.instructions.pop();
        } catch(error) {
            console.log(error);
            return this._createEmptyResponse();
        }
    }

    async getPicture() {
        try {
            // Picture
            const divPicture = this._doc.body.querySelector("div.Recipe_svtmat_recipe__mediaContainer__TUDv5");
            const imgPicture = divPicture.querySelector("img");
            const urlPicture = decodeURIComponent(imgPicture.src).split('?')[1].slice(4);
            console.log(decodeURIComponent(imgPicture.src));
            console.log(urlPicture);
            
            // Get picture and add to database
            this.recipe.image = new ObjectId();
            const response = await fetch(urlPicture); 
            if (response.ok) {
                return response.body;
            }
        } catch(error) {
            console.log(error);
        }
    }
}