
export class Alert {
    /**
     * 
     * @param { String } type - [success, error, warning, info]
     * @param { String } message 
     * @param { Object } options - Options object
     * @param { Boolean } options.dismissable - Make it possible for the user to dismiss the alert
     * @param { Number } options.timeout - 
     * @param { String } options.colorSuccess - Set background color on 'success' alert message
     * @param { String } options.colorError - Set background color on 'error' alert message
     * @param { String } options.colorWarning - Set background color on 'warning' alert message
     * @param { String } options.colorInfo - Set background color on 'info' alert message
     */
    constructor(type = "info", message = "", options = {}) {
        this.type = type;
        this.message = message;
        this.alertElement = null;
        const root = document.documentElement; 
        const colorSuccess = getComputedStyle(root).getPropertyValue('--color-success').trim();
        const colorError = getComputedStyle(root).getPropertyValue('--color-Error').trim();
        const colorWarning = getComputedStyle(root).getPropertyValue('--color-Warning').trim();
        const colorInfo = getComputedStyle(root).getPropertyValue('--color-Info').trim();
        this._options = {
            dismissible: (options.dismissable) ? options.dismissable : true,
            timeout: (options.timeout) ? options.timeout : 10000,
            color: {
                success: (options.colorSuccess) ? options.colorSuccess : colorSuccess ?? "#4caf50",
                error: (options.colorError) ? options.colorError : colorError ?? "#f44336",
                warning: (options.colorWarning) ? options.colorWarning : colorWarning ?? "#ff9800",
                info: (options.colorInfo) ? options.colorInfo : colorInfo ?? "#2196f3"
            }
        };

        this._injectStyles();
        this.createAlert();
        if (this._options.timeout) {
            setTimeout(this.dismissAlert.bind(this), this._options.timeout);
        }
    }

    _injectStyles() {
        const style = document.createElement("style");
        style.innerHTML = `
          .alert {
            padding: 16px;
            margin: 16px 0;
            border-radius: 8px;
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            max-width: 70%;
            z-index: 1060;
            font-family: Arial, sans-serif;
            color: #fff;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
    
          .alert-success {
            background-color: ${this._options.color.success};
          }
    
          .alert-error {
            background-color: ${this._options.color.error};
          }
    
          .alert-warning {
            background-color: ${this._options.color.warning};
          }
    
          .alert-info {
            background-color: ${this._options.color.info};
          }
    
          .alert-close {
            margin-left: auto;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
          }

          @keyframes slide-up {
            from {
              bottom: -100px; /* Start from below the screen */
              opacity: 0; /* Start with 0 opacity */
            }
            to {
              bottom: 20px; /* End at 20px above the bottom */
              opacity: 1; /* End with full opacity */
            }
          }

          @keyframes fade-out {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
    }

    createAlert() {
        this.alertElement = document.createElement("div");
        this.alertElement.className = `alert alert-${this.type}`;
        this.alertElement.innerText = this.message;

        if (this.dismissible) {
            const closeButton = document.createElement("button");
            closeButton.className = "alert-close";
            closeButton.innerHTML = "&times;";
            closeButton.onclick = () => this.dismissAlert();

            this.alertElement.appendChild(closeButton);
        }

        document.body.appendChild(this.alertElement);
    }

    dismissAlert() {
        if (this.alertElement) {
            this.alertElement.remove();
        }
    }

    updateAlert(type, message) {
        this.type = type;
        this.message = message;
        this.alertElement.className = `alert alert-${this.type}`;
        this.alertElement.innerText = this.message;

        if (this.dismissible) {
            const closeButton = document.createElement("button");
            closeButton.className = "alert-close";
            closeButton.innerHTML = "&times;";
            closeButton.onclick = () => this.dismissAlert();

            this.alertElement.appendChild(closeButton);
        }
    }
}
