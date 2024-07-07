

export class Switch {

    constructor(id) {
        this._id = id;
        this._switch = document.getElementById(id);
    }
}

export class SwitchDarkMode extends Switch {

    constructor(idSwitch, idHtml) {
        super(idSwitch);
        this._idHtml = idHtml; 

        this._switch.addEventListener("change", (event) => {
            const htmlElement = document.getElementById(this._idHtml);
            if (event.target.checked) {
                htmlElement.setAttribute("data-theme", "dark");
            } else {
                htmlElement.setAttribute("data-theme", "light");
            }
        });
    }
}

