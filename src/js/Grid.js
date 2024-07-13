

export class Grid {

    constructor(idGrid) {
        this._idGrid = idGrid;
        this._grid = document.getElementById(idGrid);
    }
}

export class GridSearch extends Grid {

    constructor(idGrid, idSearch, api) {
        super(idGrid);
        this._idSearch = idSearch;
        this._search = document.getElementById(idSearch);
        this._api = api;

        // Add listener
        this._search.addEventListener("keyup", async (event) => {
            const search = event.target.value;
            const url = this._api.createUrl("/recipe/search", { text: search });
            const answer = await this._api.fetch("GET", url);

            // Remove event listener and any card
            /*
            for (const card of this._grid.childNodes) {
                card.removeEventListener
            }
            */
            this._grid.textContent = "";

            answer?.result.forEach((recipe) => {
                const card = document.createElement("article");
                //card.setAttribute("data-theme","light");
                //card.setAttribute("class", "article-card")
                
                // Create header
                const header = document.createElement("header");
                header.textContent = recipe.title;
                card.appendChild(header);

                // Create body
                const body = document.createElement("img");
                body.src = this._api.createUrl("/public/test.png"); // Assuming recipe.image contains the URL of the image
                body.alt = "test-image";                            // recipe.title
                card.appendChild(body);

                // Create footer
                const footer = document.createElement("footer");
                footer.textContent = `Servings: ${recipe.servings}, ${recipe.time}`;
                card.appendChild(footer);

                // Create eventlistener

                this._grid.appendChild(card);
            });
        });
    }




}