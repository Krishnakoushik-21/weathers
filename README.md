# 🌦️ Full Stack Weather App

A beautiful, modern, and responsive weather application built with Node.js, Express, and Vanilla JavaScript. It features dynamic background themes that change based on real-time weather conditions, geolocation support, and city search with autocomplete suggestions.

![Weather App Preview](https://via.placeholder.com/800x400?text=Weather+App+Preview)

## ✨ Features

*   **Real-time Weather Data**: Fetches accurate weather information using the OpenWeatherMap API.
*   **Dynamic Backgrounds**: The application interface changes colors and gradients to reflect the current weather (Clear, Rain, Snow, Clouds, Thunderstorm).
*   **Geolocation Support**: "Use My Location" button to instantly get weather for your current position.
*   **Smart Search**: Type a city name to get auto-complete suggestions.
*   **Glassmorphism UI**: A premium, modern user interface with smooth animations and glass-like effects.
*   **Responsive Design**: Works perfectly on desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3 (transiitons, animations, glassmorphism), JavaScript (Fetch API, DOM manipulation).
*   **Backend**: Node.js, Express.js.
*   **API**: OpenWeatherMap API.
*   **Utilities**: `dotenv` (Environment variables), `cors` (Cross-Origin Resource Sharing), `axios` (HTTP requests).

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your machine.
*   An API Key from [OpenWeatherMap](https://openweathermap.org/) (it's free!).

### 📥 Installation

1.  **Clone the repository** (or download the source code):
    ```bash
    git clone <repository-url>
    cd WeatherApp
    ```

2.  **Install Dependencies**:
    Run the following command in your terminal to install the required Node.js packages:
    ```bash
    npm install
    ```

### ⚙️ Configuration

1.  Create a file named `.env` in the root directory of the project.
2.  Add your OpenWeatherMap API key to the `.env` file:
    ```env
    OPENWEATHER_API_KEY=your_api_key_here
    PORT=3000
    ```

### ▶️ Running the App

1.  **Start the Server**:
    ```bash
    npm start
    ```
    *Or run `node server.js` directly.*

2.  **Open in Browser**:
    Visit `http://localhost:3000` to see your app in action!

## 📂 Project Structure

```
WeatherApp/
├── public/              # Frontend files
│   ├── index.html       # Main HTML structure
│   ├── style.css        # Styling and animations
│   └── script.js        # Frontend logic (Search, Geolocation, UI updates)
├── .env                 # API Key configuration (Hidden)
├── server.js            # Express Backend Server
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## 🎨 Themes

The app includes specific themes for:
*   ☀️ **Clear**: Bright Orange/Yellow Sunset Gradient.
*   ☁️ **Clouds**: Soft Blue/Grey Gradient.
*   🌧️ **Rain**: Deep Teal/Blue Gradient.
*   ❄️ **Snow**: Crisp White/Pink Gradient.
*   ⚡ **Thunderstorm**: Electric Purple Gradient.
*   🌫️ **Mist/Fog**: Mysterious Grey/White Gradient.

## 🤝 Contributing

Feel free to fork this project and submit pull requests. Any improvements or new features are welcome!

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
