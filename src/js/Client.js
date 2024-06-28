
import { API } from "./API";
import { ButtonAPI } from "./Buttons";
import { InputAPI } from "./Inputs";
import { LinkPage } from './Links';

class Client {

    constructor() {
        this.__navbar = ["home", "search", "parse", "add", "delete"];

        this._api = new API("none");
        // Navbar
        this._linkHome = new LinkPage(this.__navbar, "link-home", "content-home");
        this._linkSearch = new LinkPage(this.__navbar, "link-search", "content-search");
        this._linkParse = new LinkPage(this.__navbar, "link-parse", "content-parse");
        this._linkAdd = new LinkPage(this.__navbar, "link-add", "content-add");
        this._lindDelete = new LinkPage(this.__navbar, "link-delete", "content-delete");
        // Buttons
        this._btnTest = new ButtonAPI("testButton", "primary", "xlarge", this._api);
        // Parse page
        this._btnParse = new InputAPI("parse-button", this._api, "parse")
    }

    init() {
        this._button.addClickEvent();
        this.__navbar.forEach((id) => {
            if (id === "home") return true;
            const div = document.getElementById(`content-${id}`);
            div.hidden = true;
        });
    }

}

export {
    Client
}