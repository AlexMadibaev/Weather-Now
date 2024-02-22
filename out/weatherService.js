"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const API_KEY = '7b1f0dedb99e22d693312d349d2720c1';
const API_URL = 'http://api.openweathermap.org/data/2.5/weather';
async function getWeather(city) {
    try {
        const response = await axios_1.default.get(API_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric' // or 'imperial' for Fahrenheit
            }
        });
        const weatherData = response.data;
        const temperature = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;
        return `Weather in ${city}:\nTemperature: ${temperature}°C,\nHumidity: ${humidity}%,\nWind Speed: ${windSpeed} m/s`;
    }
    catch (error) {
        throw error;
    }
}
exports.getWeather = getWeather;
//# sourceMappingURL=weatherService.js.map