import getUserLocale from "get-user-locale";


class Language {

    constructor(api, path) {
        this._tableLanguages = null;
        this._language = getUserLocale();
        this._path = path;

        const url = this._api.createUrl("/public/languages.json");
        api.fetch("GET", url)
        .then((json) => { 
            this._tableLanguages = json;
        })
        .catch((error) )
    }

    init(api, path) {

    }
}

export {
    Language
}