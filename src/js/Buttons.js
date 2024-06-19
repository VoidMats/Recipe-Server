

export class Button {

    constructor(id, type, size) {
        this._id = id;
        this._button = document.getElementById(id);
        
        this._class = "";
        switch(type.toLowerCase()) {
            case "success":
                this._class += " button-success";
                break;
            case "error":
                this._class += " button-error";
                break;
            case "warning":
                this._class += " button-warning";
                break;
            case "primary":
                this._class += " button-primary";
                break;
            case "secondary":
                this._class += " button-secondary";
                break;
            case "default":
            default:
        }

        switch(size.toLowerCase()) {
            case "xsmall":
                this._class += " button-xsmall";
                break;
            case "small":
                this._class += " button-small";
                break;
            case "large":
                this._class += " button-large";
                break;
            case "xlarge":
                this._class += " button-xlarge";
                break;
            default:
        }
        this._class += " pure-button";
        this._class = this._class.trim();
        this._button.setAttribute("class", this._class);
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

export class ButtonAPI extends Button {

    constructor(id, type, size, api) {
        super(id, type, size);
        this._api = api;
    }

    addClickEvent(url) {
        super.addClickEvent((event) => {
            console.log("working");
            console.log(event);
            this._api.fetch("GET", url)
        });
    }
}