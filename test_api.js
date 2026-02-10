require('dotenv').config();
const axios = require('axios');

async function testAPI() {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    console.log("API Key loaded:", apiKey ? "Yes (First 4 chars: " + apiKey.substring(0, 4) + ")" : "No");

    if (!apiKey) {
        console.error("ERROR: API Key is missing in .env");
        return;
    }

    const city = "London";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    console.log(`Testing API URL: ${url.replace(apiKey, "HIDDEN")}`);

    try {
        const response = await axios.get(url);
        console.log("SUCCESS! API Response received.");
        console.log("Weather:", response.data.weather[0].main);
        console.log("Temp:", response.data.main.temp);
    } catch (error) {
        console.error("FAILED to fetch from OpenWeatherMap.");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

testAPI();
