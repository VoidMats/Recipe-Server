
export class Input {

    constructor(id) {
        this._input = document.getElementById(id);
    }
}

export class InputAPI extends Input { 

    constructor(id, api, route) {
        super(id);
        this._api = api;
        this._route = route;

        // GUI

        // Handle
        this._input.addEventListener("click", async (event) => {
            event.preventDefault();
            
            // Send url to backend
            const urlRecipe = document.getElementById("parse-url");
            const urlServer = `${document.location.origin}/${this._route}`;
            const body = {
                url: urlRecipe
            }
            const result = await this._api.fetch("POST", urlServer);
            // Check result and report back to user
        });

    }


}