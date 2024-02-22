"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const weatherService_1 = require("./weatherService");
function activate(context) {
    console.log('Congratulations, your extension "weather-plugin" is now active!');
    let disposable = vscode.commands.registerCommand('extension.showWeatherPanel', () => {
        // Create and show a new webview panel
        const panel = vscode.window.createWebviewPanel('weatherPanel', // Identifies the type of the webview. Used internally
        'Weather', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in
        {
            enableScripts: true
        } // Webview options
        );
        // Set HTML content for the webview panel
        panel.webview.html = getWebviewContent(panel, context.extensionUri);
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(message => {
            // Handle messages sent from the webview
            switch (message.command) {
                case 'cityEntered':
                    // Call getWeather function with entered city
                    (0, weatherService_1.getWeather)(message.city).then(weatherInfo => {
                        // Send weather information back to the webview
                        panel.webview.postMessage({ command: 'updateWeatherInfo', weatherInfo });
                    }).catch(err => {
                        // Send error message back to the webview
                        panel.webview.postMessage({ command: 'showErrorMessage', errorMessage: 'Failed to get weather information' });
                    });
                    break;
            }
        }, undefined, context.subscriptions);
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function getWebviewContent(panel, extensionUri) {
    const styleUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'styles.css'));
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Weather Panel</title>
            <link href="${styleUri}" rel="stylesheet">
        </head>
        <body>
            <div class="container">
                <h2>WeatherNow</h2>
                <input type="text" id="cityInput" placeholder="Enter your city name">
                <button id="submitButton">Get Weather</button>
                <div class="weather-info" id="weatherInfo"></div>
            </div>
            <script>
                const vscode = acquireVsCodeApi();
                const cityInput = document.getElementById('cityInput');
                const submitButton = document.getElementById('submitButton');
                const weatherInfoDiv = document.getElementById('weatherInfo');

                submitButton.addEventListener('click', () => {
                    const city = cityInput.value.trim();
                    if (city !== '') {
                        // Send entered city to the extension
                        vscode.postMessage({ command: 'cityEntered', city });
                    }
                });

                // Handle messages from the extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.command) {
                        case 'updateWeatherInfo':
                            weatherInfoDiv.innerHTML = message.weatherInfo;
                            break;
                        case 'showErrorMessage':
                            weatherInfoDiv.innerText = message.errorMessage;
                            break;
                    }
                });
            </script>
        </body>
        </html>
    `;
}
//# sourceMappingURL=extension.js.map