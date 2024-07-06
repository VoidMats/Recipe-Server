
import { API } from "./API";
import { ButtonAPI } from "./Buttons";
import { InputAPI } from "./Inputs";
import { LinkPage } from './Links';
import { GridSearch } from "./Grid";

class Client {

    constructor() {
        this.__navbar = ["home", "search", "parse", "add", "delete"];

        this._api = new API("none");
        // Navbar
        this._linkHome = new LinkPage(this.__navbar, "link-home", "home-content");
        this._linkSearch = new LinkPage(this.__navbar, "link-search", "search-content");
        this._linkParse = new LinkPage(this.__navbar, "link-parse", "parse-content");
        this._linkAdd = new LinkPage(this.__navbar, "link-add", "add-content");
        this._lindDelete = new LinkPage(this.__navbar, "link-delete", "delete-content");
        // Buttons
        this._btnTest = new ButtonAPI("testButton", "primary", "xlarge", this._api);
        // Search page
        this._search = new GridSearch("search-grid", "search-input", this._api);  
        // Parse page
        this._btnParse = new InputAPI("parse-button", this._api, "parse");

    }

    init() {
        this._btnTest.addClickEvent();
        this.__navbar.forEach((id) => {
            if (id === "home") return true;
            const div = document.getElementById(`${id}-content`);
            div.hidden = true;
        });
    }

}

export {
    Client
}