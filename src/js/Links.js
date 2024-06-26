

export class Link {

    constructor(id) {
        this._id = id;
        this._type = type;
        this._size = size;
        this._link = document.getElementById(id);

        this._class = "pure-menu-item";
        this._link.setAttribute("class", this._class);
    }
}

export class LinkPage extends Link {

    constructor(id, api, page) {
        super(id, type, size);
        this._api = api;
        this._page = page;

        const a = document.createElement("a");
        a.setAttribute("class", "pure-menu-link");
        a.onclick(async (event) => {
            event.preventDefault();

            const url = `${this._api.location}/${this._page}`;
            const html = await this._api.fetch("GET", url);
            const 
        })
        
        this._link.appendChild(a);
    }
}