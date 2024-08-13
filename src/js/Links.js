

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

export class LinkMenu extends Link {

    constructor(id, ) {
        super(id);
        this._link.classList.add("dropdown");

        const a = document.createElement("a");
        a.classList.add("dropdown-toggle");
        a.href = "#";
        // TODO WIP
    }
}

export class LinkMenuIcon extends Link {

    constructor(id) {
        super(id);
        this._link.classList.add("dropdown");

        /*
        <li class="dropdown">
            <a href="#" class="dropdown-toggle">Languages <i class="fas fa-angle-down"></i></a>
            <ul class="dropdown-menu">
                <li><a href="#"><i class="fab fa-html5"></i> HTML</a></li>
                <li><a href="#"><i class="fab fa-css3-alt"></i> CSS</a></li>
                <li><a href="#"><i class="fab fa-js"></i> JavaScript</a></li>
                <li><a href="#"><i class="fab fa-python"></i> Python</a></li>
            </ul>
        </li>
        */

        // GUI
        const a = document.createElement("a");
        a.classList.add("dropdown-toggle");
        a.href = "#";

        const ul = document.createElement("ul");
        ul.classList.add("dropdown-menu");

        let text = this._id.split('-')[1];
        text = text[0].toUpperCase() + text.slice(1);
        a.appendChild(document.createTextNode(text));
    }

    init() {
        var dropdowns = document.querySelectorAll('.dropdown-toggle');
    
        dropdowns.forEach(function (dropdown) {
            dropdown.addEventListener('click', function (event) {
                event.preventDefault();
                var dropdownMenu = this.nextElementSibling;
                dropdownMenu.classList.toggle('show');
            });
        });
    }
}

export class LinkRecipe extends Link {

    constructor(id) {
        super(id)
    }
}