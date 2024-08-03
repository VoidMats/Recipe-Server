
import getUserLocale from 'get-user-locale';

import { API } from "./API";
import { ButtonApi, ButtonApiModal } from "./Buttons";
import { InputAPI } from "./Inputs";
import { LinkPage } from './Links';
import { GridSearch, GridSearchTags } from "./Grid";
import { Recipe } from "./Recipe";
import { SwitchDarkMode } from "./Switch";

class Client {

    constructor() {
        this.__pages = ["home", "search", "parse", "add", "delete", "recipe"];
        this._api = new API("none");
        this._language = getUserLocale();

        // Navbar
        this._linkHome = new LinkPage(this, "link-home", "home-content");
        this._linkSearch = new LinkPage(this, "link-search", "search-content");
        this._linkParse = new LinkPage(this, "link-parse", "parse-content");
        this._linkAdd = new LinkPage(this, "link-add", "add-content");
        this._lindDelete = new LinkPage(this, "link-delete", "delete-content");
        this._switchDarkMode = new SwitchDarkMode("dark-mode-switch", "html-main");
        // Buttons
        //this._btnTest = new ButtonAPI("testButton", "primary", "xlarge", this._api);
        // Search page
        this._searchTags = new GridSearchTags(this, "search-grid-tag");
        this._search = new GridSearch(this, "search-grid", "search-input");
        // Parse page
        this._parse = new ButtonApiModal(this, "parse-button", undefined, "parse-modal");
        this._parse.addClickFunction(async (event) => {
            event.preventDefault();
            
            // Send url to backend
            const elementUrl = document.getElementById("parse-url")
            const urlRecipe = elementUrl.value;
            const urlServer = this._api.createUrl("/parse");
            const payload = {
                url: urlRecipe
            }
            const result = await this._api.fetch("POST", urlServer, payload);
            
            // Check result and report back to user
            if (result && result._id) {
                elementUrl.textContent = "";
                this._recipe.addRecipeToPage(result._id);
                this.setPage("recipe");
            }
        }) 
        // Recipe page
        this._recipe = new Recipe(this, "recipe-content");

        // My stuff 
        const rootStyles = getComputedStyle(document.documentElement);
        const picoCardBackgroundColor = rootStyles.getPropertyValue('--pico-card-border-color').trim();
        
        // Lighten the color by 20%
        const lighterColor = this.createLighterColor(picoCardBackgroundColor, 20);
        

    }

    init() {
        this.setPage("home");    
    }

    /**
     * 
     * @param { String } page 
     */
    setPage(page) {
        for (const id of this.__pages) {
            const div = document.getElementById(`${id}-content`);
            if (id === page) {
                div.hidden = false;
                continue;
            }
            div.hidden = true;
        }
    }

    /**
     * Return 
     * @param { } color - 
     * @param { Number } percent - 
     * @returns { } 
     */
    createLighterColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = (num >> 8 & 0x00FF) + amt,
            B = (num & 0x0000FF) + amt;
        return `#${(
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255))
            .toString(16)
            .slice(1)}`;
    }

}

export {
    Client
}