

export class Link {

    constructor(id) {
        this._id = id;
        this._link = document.getElementById(id);

        //this._class = "pure-menu-item";
        //this._link.setAttribute("class", this._class);
    }
}

export class LinkPage extends Link {

    constructor(navbar, id, idPage) {
        super(id);
        this._idPage = idPage;
        this._navbar = navbar;

        // GUI
        const a = document.createElement("a");
        //a.setAttribute("class", "pure-menu-link");
        a.href = "#";
        let text = this._id.split('-')[1];
        text = text[0].toUpperCase() + text.slice(1);
        a.appendChild(document.createTextNode(text));

        // Handle
        a.addEventListener("click", async (event) => {
            event.preventDefault();

            this._navbar.forEach((id) => {
                const div = document.getElementById(`content-${id}`);
                div.hidden = true;
            });
            const div = document.getElementById(this._idPage);
            div.hidden = false;
        });
        
        this._link.appendChild(a);
    }
}