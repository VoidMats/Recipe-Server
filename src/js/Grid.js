

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
            // this._search.Value
            const url = this._api.createUrl("/recipe/search", { text: 'K' });
            const answer = await this._api.fetch("GET", url);

            // Remove any card
            this._grid.textContent = "";
            answer?.result.forEach((recipe) => {
                console.log(recipe);

                const card = document.createElement("article");
                const header = document.createElement("header");
                header.title = recipe.title;
                const footer = document.createElement("footer");
                footer.text = `Servings: ${recipe.servings}, Time: ${recipe.time}`;

                card.appendChild(header);
                card.appendChild(footer);
                this._grid.appendChild(card);
            })
        });


    }


}