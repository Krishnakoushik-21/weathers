require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// API Route for Weather (City or Lat/Lon)
app.get('/api/weather', async (req, res) => {
    console.log(`Request received: ${req.originalUrl}`);
    const { city, lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: API Key missing.' });
    }

    if (!city && (!lat || !lon)) {
        return res.status(400).json({ error: 'Please provide a city name or location.' });
    }

    try {
        let url;
        if (city) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        }

        const response = await axios.get(url);
        const data = response.data;

        const weatherData = {
            city: data.name,
            temp: data.main.temp,
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind: data.wind.speed,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        };

        res.json(weatherData);

    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                return res.status(404).json({ error: 'Location not found.' });
            }
            return res.status(error.response.status).json({ error: 'Error fetching weather data.' });
        } else {
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }
});

// New Route: City Suggestions
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!query) return res.json([]);

    try {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`;
        const response = await axios.get(url);
        // Map to simpler format
        const suggestions = response.data.map(item => ({
            name: item.name,
            country: item.country,
            state: item.state || ''
        }));
        res.json(suggestions);
    } catch (error) {
        console.error("Search API Error:", error.message);
        res.json([]); // Return empty on error to avoid breaking UI
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
