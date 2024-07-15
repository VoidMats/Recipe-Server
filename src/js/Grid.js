

export class Grid {

    constructor(idGrid) {
        this._idGrid = idGrid;
        this._grid = document.getElementById(idGrid);
    }
}

export class GridSearch extends Grid {

    constructor(client, idGrid, idSearch) {
        super(idGrid);
        this._client = client;
        this._idSearch = idSearch;
        this._search = document.getElementById(idSearch);

        // Add listener
        this._search.addEventListener("keyup", async (event) => {
            const search = event.target.value;
            const url = this._client._api.createUrl("/recipe/search", { text: search });
            const answer = await this._client._api.fetch("GET", url);

            // Remove event listener and any card
            for (const card of this._grid.childNodes) {
                card.removeEventListener("click", this.setRecipePage.bind(this._client));
            }
            this._grid.textContent = "";

            answer?.result.forEach((recipe) => {
                const card = document.createElement("article");
                card.id = recipe._id;
                //card.setAttribute("data-theme","light");
                //card.setAttribute("class", "article-card")
                
                // Create header
                const header = document.createElement("header");
                header.textContent = recipe.title;
                card.appendChild(header);

                // Create body
                const body = document.createElement("img");
                body.src = this._client._api.createUrl("/public/test.png"); // Assuming recipe.image contains the URL of the image
                body.alt = "test-image";                            // recipe.title
                card.appendChild(body);

                // Create footer
                const footer = document.createElement("footer");
                footer.textContent = `Servings: ${recipe.servings}, ${recipe.time}`;
                card.appendChild(footer);

                // Create eventlistener
                card.addEventListener("click", this.setRecipePage.bind(this._client))

                this._grid.appendChild(card);
            });
        });
    }

    async setRecipePage(event) {
        console.log("Trigger click on recipe card");
        console.log(event.currentTarget.id)
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