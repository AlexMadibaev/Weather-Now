import axios from 'axios';

const API_KEY = '7b1f0dedb99e22d693312d349d2720c1';
const API_URL = 'http://api.openweathermap.org/data/2.5/weather';

export async function getWeather(city: string): Promise<string> {
    try {
        const response = await axios.get(API_URL, {
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
    } catch (error) {
        throw error;
    }
}
