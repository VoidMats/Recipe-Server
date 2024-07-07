

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
        this._api = api;
        this._search = document.getElementById(idSearch);

        // Add listener
        this._search.addEventListener("keyup", async (event) => {
            const search = event.target.value;
            console.log(search);
            const url = this._api.createUrl("/recipe/search", { text: search });
            const answer = await this._api.fetch("GET", url);

            // Remove any card
            this._grid.textContent = "";
            answer?.result.forEach((recipe) => {
                const card = document.createElement("article");
                //card.setAttribute("data-theme","light");
                
                // Create header
                const header = document.createElement("header");
                header.textContent = recipe.title;
                card.appendChild(header);

                // Create body
                const image = document.createElement("img");
                //image.src = recipe.image; // Assuming recipe.image contains the URL of the image
                //image.alt = recipe.title;
                card.appendChild(image);

                // Create footer
                const footer = document.createElement("footer");
                footer.textContent = `Servings: ${recipe.servings}, ${recipe.time}`;
                card.appendChild(footer);

                this._grid.appendChild(card);
            })
        });


    }


}