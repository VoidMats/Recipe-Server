
import { API } from "./API";
import { ButtonAPI } from "./Buttons";
import { InputAPI } from "./Inputs";
import { LinkPage } from './Links';
import { GridSearch } from "./Grid";
import { Recipe } from "./Recipe";
import { SwitchDarkMode } from "./Switch";

class Client {

    constructor() {
        this.__pages = ["home", "search", "parse", "add", "delete", "recipe"];
        this._api = new API("none");

        // Navbar
        this._linkHome = new LinkPage(this, "link-home", "home-content");
        this._linkSearch = new LinkPage(this, "link-search", "search-content");
        this._linkParse = new LinkPage(this, "link-parse", "parse-content");
        this._linkAdd = new LinkPage(this, "link-add", "add-content");
        this._lindDelete = new LinkPage(this, "link-delete", "delete-content");
        this._switchDarkMode = new SwitchDarkMode("dark-mode-switch", "html-main");
        // Buttons
        this._btnTest = new ButtonAPI("testButton", "primary", "xlarge", this._api);
        // Search page
        this._search = new GridSearch(this, "search-grid", "search-input");  
        // Parse page
        this._parse = new InputAPI("parse-button", this._api, "parse"); // TODO this has to be better
        // Recipe page
        this._recipe = new Recipe(this, "recipe-content");

    }

    init() {
        this._btnTest.addClickEvent();
        this.__pages.forEach((id) => {
            if (id === "home") return true;
            const div = document.getElementById(`${id}-content`);
            div.hidden = true;
        });
    }

}

export {
    Client
}