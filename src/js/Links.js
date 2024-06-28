

export class Link {

    constructor(id) {
        this._id = id;
        this._link = document.getElementById(id);

        this._class = "pure-menu-item";
        this._link.setAttribute("class", this._class);
    }
}

export class LinkPage extends Link {

    constructor(id, idPage) {
        super(id);
        this._idPage = idPage;

        const a = document.createElement("a");
        a.setAttribute("class", "pure-menu-link");
        a.href = "#";
        let text = this._id.split('-')[1];
        text = text[0].toUpperCase() + text.slice(1);
        a.appendChild(document.createTextNode(text));

        a.addEventListener("click", async (event) => {
            event.preventDefault();

            ["home", "search", "add", "delete"].forEach((id) => {
                const div = document.getElementById(`content-${id}`);
                div.hidden = true;
            });
            const div = document.getElementById(this._idPage);
            div.hidden = false;

            //const url = `${this._api.location}/${this._page}`;
            //const html = await this._api.fetch("GET", url);    
        });
        
        this._link.appendChild(a);
    }
}