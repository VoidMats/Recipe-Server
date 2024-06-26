import 'purecss/build/pure.css';

import { API } from "./API";
import { ButtonAPI } from "./Buttons";

class Client {

    constructor() {
        this._api = new API("none");
        // Sidebar
        
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