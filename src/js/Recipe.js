
import { Alert } from "./Alert";

export class Recipe {

    constructor(client, containerId) {
        this._client = client;
        this._containerId = containerId;
        this._recipe = null;
    }
    
    /**
     * Create the html page for a recipe
     * @param { String } recipeId 
     */
    async addRecipeToPage(recipeId) {
        // Hide all pages
        this._client.__pages.forEach((id) => {
            const div = document.getElementById(`${id}-content`);
            if (id === "recipe") {
                div.hidden = false;
            } else {
                div.hidden = true;
            }

        });

        // Get recipe 
        const url = this._client._api.createUrl(`/recipe/${recipeId}`, { language: this._client._language });
        const response = await this._client._api.fetch("GET", url);
        if (response.success) {
            const recipe = response.result;
            //this._recipe = recipe;

            // Get container element
            const root = document.getElementById(this._containerId);
            root.hidden = false;
            // Header
            const headerContainer = document.createElement("div");
            headerContainer.classList.add("header-container");
            headerContainer.style.display = "flex";
            headerContainer.style.alignItems = "center";

            const header = document.createElement("h2");
            header.className = 'content-subhead';
            header.textContent = recipe.title;
            // Button container
            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.gap = "10px";
            buttonContainer.style.marginLeft = "auto";
            // Add button for delete
            const headerButtonDelete = document.createElement("button");
            headerButtonDelete.id = "recipe-header-button";
            headerButtonDelete.textContent = this._client.getWord("delete", "general", true);
            headerButtonDelete.classList.add("button-header");
            headerButtonDelete.addEventListener("click", (event) => this.deleteRecipe(event, recipe._id));
            // Add button for edit
            const headerButtonEdit = document.createElement('button');
            headerButtonEdit.id = "recipe-header-button";
            headerButtonEdit.textContent = this._client.getWord("edit", "general", true);
            headerButtonEdit.classList.add("button-header");
            headerButtonEdit.addEventListener("click", (event) => this.editRecipe(event, recipe._id));
            // Append to header
            headerContainer.appendChild(header);
            buttonContainer.appendChild(headerButtonDelete);
            buttonContainer.appendChild(headerButtonEdit);
            headerContainer.appendChild(buttonContainer);
            headerContainer.appendChild(headerButtonDelete);

            // Info tags
            const info = document.createElement("div");
            info.classList.add("recipe-info");
            // Info id
            const infoId = document.createElement("div");
            infoId.classList.add("recipe-info-tag");
            const textId = document.createTextNode(`Id: ${recipe._id}`);
            infoId.appendChild(textId);
            // Info serving
            const infoServing = document.createElement("div");
            infoServing.classList.add("recipe-info-tag");
            const iconServing = document.createElement("img");
            iconServing.src = this._client._api.createUrl("/public/cutlery.png");
            iconServing.alt, "Servings";
            iconServing.classList.add("recipe-info-icon");
            const textServing = document.createTextNode(`${recipe.servings}`);
            infoServing.appendChild(iconServing);
            infoServing.appendChild(textServing);
            // Info time
            const infoTime = document.createElement("div");
            infoTime.classList.add("recipe-info-tag");
            const iconTime = document.createElement("img");
            iconTime.src = this._client._api.createUrl("/public/clock.png");
            iconTime.alt = "Time";
            iconTime.classList.add("recipe-info-icon");
            const textTime = document.createTextNode(`${recipe.time}`);
            infoTime.appendChild(iconTime);
            infoTime.appendChild(textTime);
            // Info temperature
            
            // Group info tags
            info.appendChild(infoId);
            info.appendChild(infoServing);
            info.appendChild(infoTime);

            // Keywords tags
            const keywords = document.createElement("div");
            keywords.classList.add("recipe-info");
            // Add keywords
            for (const keyword of recipe.keywords) {
                const tag = document.createElement("div");
                tag.classList.add("recipe-info-keyword");
                const text = document.createTextNode(keyword);
                tag.appendChild(text);
                keywords.appendChild(tag);
            }

            // Add a grid with picture and description
            const grid2 = document.createElement('div');
            grid2.className = 'grid';
            grid2.style.display = 'grid';
            grid2.style.gridTemplateColumns = 'repeat(2, 1fr)';
            grid2.style.gap = '10px';

            const img = document.createElement('img');
            if (recipe.image) {
                img.src = this._client._api.createUrl(`/file/${recipe.image}/download`);
            } else {
                img.src = this._client._api.createUrl(`/public/missing.png`);
            }
            img.alt = 'Recipe image';
            img.classList.add("recipe-image");

            const descriptionTextarea = document.createElement('textarea');
            descriptionTextarea.readOnly = true;
            descriptionTextarea.textContent = recipe.description;
            descriptionTextarea.classList.add("recipe-textarea");

            grid2.appendChild(img);
            grid2.appendChild(descriptionTextarea);

            const grid3 = document.createElement('div');
            grid3.className = 'grid';
            grid3.style.display = 'grid';
            grid3.style.gridTemplateColumns = 'repeat(2, 1fr)';
            grid3.style.gap = '0';

            // Create the ingredient div
            const ingDiv = document.createElement('div');

            const ingH5 = document.createElement('h5');
            ingH5.style.paddingTop = '10px';
            ingH5.textContent = this._client.getWord("delete", "general", true);'Ingredients';
            ingDiv.appendChild(ingH5);

            for (const component of recipe.components) {
                const ingHeader = document.createElement("p");
                ingHeader.textContent = component.name;
                ingDiv.appendChild(ingHeader);
                
                const ingList = document.createElement('ul');
                for (const item of component.ingredients) {
                    const li = document.createElement('li');
                    li.textContent = `${item.size} ${item.unit}${(item.size) ? " - " : ""}${item.ingredient}`;
                    li.style.fontFamily = 'inherit';
                    ingList.appendChild(li);
                }
                ingDiv.appendChild(ingList);
            }

            // Create the instruction div
            const insDiv = document.createElement('div');

            const insH5 = document.createElement('h5');
            insH5.style.paddingTop = '10px';
            insH5.textContent = this._client.getWord("instruction", "general", true);
            insDiv.appendChild(insH5);

            if (Array.isArray(recipe.instructions)) {
                for (const instruction of recipe.instructions) {
                    const insHeader = document.createElement("p");
                    insHeader.textContent = instruction.name;
                    insDiv.appendChild(insHeader);
    
                    const insList = document.createElement('ol');
                    for (const item of instruction.steps) {
                        const li = document.createElement('li');
                        li.textContent = item;
                        li.style.fontFamily = 'inherit';
                        insList.appendChild(li);
                    }
                    insDiv.appendChild(insList);
                }
            }

            grid3.appendChild(ingDiv);
            grid3.appendChild(insDiv);

            // Append all elements
            root.appendChild(headerContainer);
            root.appendChild(info);
            root.appendChild(keywords);
            root.appendChild(grid2);
            root.appendChild(grid3);
        } else {
            new Alert("error", response.error, { dismissable: true });
        }
    }

    removeRecipeFromPage() {
        const buttonDelete = document.getElementById("recipe-button-delete");
        if (buttonDelete) {
            buttonDelete.removeEventListener("click", this.deleteRecipe);
        }
        // Get container element
        const root = document.getElementById(this._containerId);
        root.replaceChildren();
        root.hidden = true;
    }

    async deleteRecipe(event, id) {
        event.preventDefault();
        const url = this._client._api.createUrl(`/recipe/${id}`, { language: this._client._language });
        const response = await this._client._api.fetch("DELETE", url);
        if (response.success) {
            this.removeRecipeFromPage();
            // Hided all pages
            for (const page of this._client.__pages) {
                const div = document.getElementById(`${page}-content`);
                div.hidden = true;
            }
            // Clear seach and search cards
            this._client._search.clearSearchGrid(true);
            // Unhide search
            const div = document.getElementById("search-content");
            div.hidden = false;
        } else {
            new Alert("error", response.error, { dismissable: true });
        }
    }

    editRecipe(event, id) {
        event.preventDefault();

    }
}
