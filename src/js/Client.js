import 'purecss/build/pure.css';

import { API } from "./API";
import { ButtonAPI } from "./Buttons";
import { LinkPage } from './Links';

class Client {

    constructor() {
        this._api = new API("none");
        // Sidebar
        this._linkHome = new LinkPage("link-home", "content-home");
        this._linkSearch = new LinkPage("link-search", "content-search");
        this._linkAdd = new LinkPage("link-add", "content-add");
        this._lindDelete = new LinkPage("link-delete", "content-delete");
        // Buttons
        this._button = new ButtonAPI("testButton", "primary", "xlarge", this._api);
    }

    init() {
        this._button.addClickEvent();
    }

}

export {
    Client
}