

export class Button {

    constructor(id) {
        this._id = id;
        this._button = document.getElementById(id);
    }

    addClickEvent(func) {
        this._button.addEventListener("click", func);
    }

    addStyle(style) {
        this._button.style(style);
    }

    disable(value) {
        this._button.setAttribute("disabled", value);
    }
}

export class ButtonApi extends Button {

    constructor(client, id, route) {
        super(id);
        this._client = client;
        this._route = route;

        if (!this._id || !this._client) throw new Error("Need both id and client as parameter");

        if (this._route) {
            super.addClickEvent(async (event) => {
                event.preventDefault();
                console.log("Calling server api");
                
                const url = this._client._api.createUrl(this._route);
                const result = await this._client._api.fetch("GET", url);
                if (!result.success) {
                    throw new Error(result.message)
                } 
            });
        }
    }

    addClickEvent(method, route, queries, payload) {
        super.addClickEvent(async (event) => {
            event.preventDefault();
            console.log("Calling server api custom event function");

            const url = this._client._api.createUrl(route, queries);
            const result = await this._client._api.fetch(method, url, payload);
            console.log(result);
            if (!result.success) {
                throw new Error(result.message);
            }
        });
    }

    addClickFunction(func) {
        super.addClickEvent(func);
    }
}

export class ButtonApiModal extends ButtonApi {
    
    constructor(client, id, route, modal) {
        super(client, id, route);
        this._modal = modal;

    }

    addClickEvent(method, route, queries, paylaod) {
        super.addClickEvent(async (event) => {
            event.preventDefault();
            console.log("Calling server api custom event function");

            const url = this._client._api.createUrl(route, queries);
            const result = await this._client._api.fetch(method, url, payload);
            console.log(result);
            if (!result.success) {
                throw new Error(result.message);
            } else {
                const modal = document.getElementById(this._modal);
            }
        });
    }

    addClickFunction(func) {
        super.addClickFunction(func);
    }
}