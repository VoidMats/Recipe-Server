

export class Link {

    constructor(id) {
        this._id = id;
        this._link = document.getElementById(id);

        //this._class = "pure-menu-item";
        //this._link.setAttribute("class", this._class);
    }
}

export class LinkPage extends Link {

    constructor(client, id, idPage) {
        super(id);
        this._client = client;
        this._idPage = idPage;

        // GUI
        const a = document.createElement("a");
        a.href = "#";
        let text = this._id.split('-')[1];
        text = text[0].toUpperCase() + text.slice(1);
        a.appendChild(document.createTextNode(text));

        // Handle
        a.addEventListener("click", async (event) => {
            event.preventDefault();

            // Hide all pages
            for (const page of this._client.__pages) {
                const div = document.getElementById(`${page}-content`);
                div.hidden = true;
                // Remove recipe page
                if (page === "recipe") {
                    this._client._recipe.removeRecipeFromPage();
                }
            }

            const div = document.getElementById(this._idPage);
            div.hidden = false;
        });
        
        this._link.appendChild(a);
    }
}

export class LinkRecipe extends Link {

    constructor(id) {
        super(id)
    }
}