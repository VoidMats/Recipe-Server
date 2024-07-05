

export class Grid {

    constructor(idGrid) {
        this._idGrid = idGrid;
        this._grid = document.getElementById(idGrid);
    }
}

export class GridSearch extends Grid {

    constructor(idGrid, idSearch) {
        super(idGrid);
        this._idSearch = idSearch;
        this._search = document.getElementById(idSearch);

        // Add listener
        this._search.addEventListener("keydown", async (event) => {
            const result = ["test"];

            result.forEach((recipe) => {
                this._grid.textContent = "";

                const card = document.createElement("article");
                const header = document.createElement("header");
                const footer = document.createElement("footer");

                card.appendChild(header);
                card.appendChild(footer);
                this._grid.appendChild(card);
            })
        });


    }


}