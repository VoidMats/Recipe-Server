

export class ButtonGeneral {

    constructor(api) {
        this._api = api;
    }

    addClickEvent(id) {
        const button = document.getElementById(id);
        button.addEventListener("click", (event) => {
            console.log("working");
            console.log(event);
        });
        console.log(this._self)
    }
}