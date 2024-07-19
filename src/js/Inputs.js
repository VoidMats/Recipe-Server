
export class Input {

    constructor(id) {
        this._id = id;
        this._input = document.getElementById(id);
    }
}

export class InputAPI extends Input { 

    constructor(client, id, route) {
        super(id);
        this._client = client;
        this._route = route;

        // GUI

        // Handle
        this._input.addEventListener("click", async (event) => {
            event.preventDefault();
            
            // Send url to backend
            const urlRecipe = document.getElementById("parse-url").value;
            console.log(urlRecipe);
            const urlServer = this._client._api.createUrl(route);
            const payload = {
                url: urlRecipe
            }
            const result = await this._client._api.fetch("POST", urlServer, payload);
            console.log(result)
            // Check result and report back to user
            if (result) {

            }
        });
    }
}
