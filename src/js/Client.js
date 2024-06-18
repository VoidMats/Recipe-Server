import { API } from "./API";
import { ButtonGeneral } from "./ButtonGeneral";

class Client {

    constructor() {
        this._api = new API();
        this._button = new ButtonGeneral(this._api);
    }

    init() {
        this._button.addClickEvent("testButton");
    }

}

export {
    Client
}