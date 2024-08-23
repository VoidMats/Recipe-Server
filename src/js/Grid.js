

export class Grid {

    constructor(idGrid) {
        this._idGrid = idGrid;
        this._grid = document.getElementById(idGrid);
    }

    
}

export class GridSearchTags extends Grid {

    constructor(client, idGrid) {
        super(idGrid);
        this._client = client;

        // Create buttons
        Object.keys(this._client._tableLanguages.meal)
        .forEach(ingredient => {
            const btn = document.createElement("button");
            btn.setAttribute("class", "outline button-search-tag");
            const text = this._client.getWord(ingredient, "meal", true);
            btn.setAttribute("word", ingredient);
            btn.textContent = text;
            btn.addEventListener("click", (event) => {
                event.preventDefault();
                btn.classList.toggle('active');
            });
            this._grid.appendChild(btn);
        })
    }

    setLanguage() {
        console.log("trigger setLanguage in GridSearchTags")
        const buttons = this._grid.querySelectorAll('.button-search-tag');
        for (const button of buttons) {
            const word = button.getAttribute("word");
            const text = this._client.getWord(word, "meal", true);
            console.log(text);
            button.textContent = text;
        }
    }
}

export class GridSearch extends Grid {

    /**
     * 
     * @param { Object } client 
     * @param { String } idGrid 
     * @param { String } idSearch 
     */
    constructor(client, idGrid, idSearch, idButton) {
        super(idGrid);
        this._client = client;
        this._idSearch = idSearch;
        this._idButton = idButton;
        this._search = document.getElementById(idSearch);
        this._button = document.getElementById(idButton);

        this._search.addEventListener("keyup", async (event) => {
            const tags = document.querySelectorAll('.button-search-tag.active');
            const ingredients = Array.from(tags).map((tag) => {
                return tag.textContent.toLowerCase();
            });
            
            const text = event.target.value;
            const url = this._client._api.createUrl("/recipe/search", 
                { text, ingredients, language: this._client._language }
            );
            const answer = await this._client._api.fetch("GET", url);

            // Remove event listener and any card
            for (const card of this._grid.childNodes) {
                card.removeEventListener("click", this.setRecipePage.bind(this._client));
            }
            this._grid.textContent = "";

            answer?.result.forEach((recipe) => {
                const card = document.createElement("article");
                card.id = recipe._id;
                
                // Create header
                const header = document.createElement("div");
                header.setAttribute("class", "article-header");
                header.textContent = recipe.title;
                card.appendChild(header);

                // Create body 
                // TODO Get image from database
                const body = document.createElement("img");
                body.setAttribute("class", "article-img");
                body.src = this._client._api.createUrl("/public/missing.png");
                body.alt = "test-image";                                  
                card.appendChild(body);

                // Create footer
                const footer = document.createElement("div");
                footer.setAttribute("class", "article-footer");
                // Create image element for the icon
                const icon = document.createElement("img");
                icon.src = this._client._api.createUrl("/public/cutlery.png");
                icon.alt, "Cutlery";
                icon.setAttribute("class", "article-footer-icon");
                // Append the icon and text to the footer
                footer.appendChild(icon);
                footer.appendChild(document.createTextNode(`${recipe.servings}, ${recipe.time}`));
                card.appendChild(footer);

                // Create eventlistener
                card.addEventListener("click", this.setRecipePage.bind(this._client))

                this._grid.appendChild(card);
            });
        });
    }

    async setRecipePage(event) {
        for (const id of this.__pages) {
            const div = document.getElementById(`${id}-content`);
            if (id === "recipe") {
                div.hidden = false;
                await this._recipe.addRecipeToPage(event.currentTarget.id);
                continue;
            }
            div.hidden = true;
        }
    }


}