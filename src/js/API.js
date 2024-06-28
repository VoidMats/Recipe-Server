

export class API {
    /**
     * 
     * @param {*} auth 
     */
    constructor(auth = "none") {
        this._token = null; // This will be the general token/session 
        this._auth = auth;
        this.location = document.location
    }

    async fetch(method, url, payload, signal) {
        const headers = {};
        const options = {};

        if (signal !== null) {
            options["signal"] = signal;
        }

        if (auth === "basic") {
            headers["Authorization"] = `Bearer ${this._token}`;
        }
       
        options["method"] = method.toUpperCase();
        if (this._httpsAgent) method["agent"] = this._httpsAgent;
        
        if (payload) {
            options["body"] = JSON.stringify(payload);
            headers["Content-Type"] = "application/json";
        }
        options['headers'] = headers;
        
        try {
            const response = await fetch(url, options);
            return this._checkStatus(response);
        } catch(error) {
            console.log(error);
        }
    }

    async _checkStatus(response) {
        if (response.ok) {
            const type = (response.headers) ? response.headers.get("Content-Type") : undefined;
            switch (type) {
                case "application/json; charset=utf-8":
                case "application/json":
                    return response.json();
                case "application/octet-stream":
                    return response.body;
                case "text/plain; charset=utf-8":
                case "text/plain":
                    return response.text();
                case "text/html; charset=utf-8":
                case "text/html":
                    return response.text();
                default:
                    return response;
            }
        } else if (response.status === 401) {
            let answer
            this._counter += 1;
            if (this._counter > 1) {
                answer = {
                    timestamp: new Date().toLocaleString(),
                    success: false,
                    code: 401,
                    error: "User has not access to this plan"
                }
                this._counter = 0;
            }
            this._updateToken(true);
            answer = {
                timestamp: new Date().toLocaleString(),
                success: false,
                code: 401,
                error: `${response.statusText} - `,
            }
            return answer;
        } else if (response.status >= 400) {
            let errorMessage = {
                timestamp: new Date().toLocaleString(),
                success: false,
                code: response.status,
                error: response.statusText
            }
            // TODO this is not correct
            const msg = `<== Error: ${response.url} - ${response.status} - ${response.statusText}`
            const type = (response.headers) ? response.headers.get("content-type") : undefined;
            console.error(msg);
            if (type === "application/json; charset=utf-8" || type === "application/json") {
                const answer = await response.json();
                errorMessage.code = answer.errorCode;
                errorMessage.error = answer.message;
                errorMessage["referenceId"] = answer.referenceId;
            }
            return errorMessage;
        } else {
            this._counter = 0;
            throw new Error(`<== Unknown error in plugin splan - fetching error: ${response.statusText}`);
        }
    }
}