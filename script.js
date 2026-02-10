const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const suggestionsList = document.getElementById('suggestions');
const weatherInfo = document.getElementById('weatherInfo');
const errorMsg = document.getElementById('errorMsg');
const body = document.body;

let debounceTimer;

// Event Listeners
searchBtn.addEventListener('click', () => fetchWeather(cityInput.value));
locationBtn.addEventListener('click', getUserLocation);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        suggestionsList.classList.add('hidden');
        fetchWeather(cityInput.value);
    }
});

cityInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchSuggestions(cityInput.value), 300);
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) {
        suggestionsList.classList.add('hidden');
    }
});

async function getUserLocation() {
    console.log("Location button clicked");

    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser");
        return;
    }

    // Visual feedback
    const originalPlaceholder = cityInput.placeholder;
    cityInput.placeholder = "Locating...";
    cityInput.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log("Position found:", position);
            const { latitude, longitude } = position.coords;
            fetchWeather(null, latitude, longitude);
            cityInput.placeholder = originalPlaceholder;
            cityInput.disabled = false;
        },
        (error) => {
            console.error("Geolocation error:", error);
            let msg = "Unable to retrieve location.";
            if (error.code === 1) msg = "Location permission denied. Please allow access."; // User denied
            if (error.code === 2) msg = "Location unavailable."; // Position unavailable
            if (error.code === 3) msg = "Location request timed out."; // Timeout

            showError(msg);
            cityInput.placeholder = originalPlaceholder;
            cityInput.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

async function fetchSuggestions(query) {
    if (query.length < 3) {
        suggestionsList.classList.add('hidden');
        return;
    }

    try {
        const response = await fetch(`/api/search?q=${query}`);
        const suggestions = await response.json();

        if (suggestions.length > 0) {
            renderSuggestions(suggestions);
        } else {
            suggestionsList.classList.add('hidden');
        }
    } catch (error) {
        console.error("Error fetching suggestions");
    }
}

function renderSuggestions(suggestions) {
    suggestionsList.innerHTML = '';
    suggestions.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <span class="state">${item.state || ''} ${item.country}</span>`;
        li.addEventListener('click', () => {
            cityInput.value = item.name;
            suggestionsList.classList.add('hidden');
            fetchWeather(item.name);
        });
        suggestionsList.appendChild(li);
    });
    suggestionsList.classList.remove('hidden');
}

async function fetchWeather(city, lat = null, lon = null) {
    const errorMsg = document.getElementById('errorMsg');
    const weatherInfo = document.getElementById('weatherInfo');

    if (!city && (!lat && !lon)) return;

    // Reset UI
    errorMsg.classList.add('hidden');
    weatherInfo.classList.add('hidden');

    try {
        let url;
        if (city) {
            url = `/api/weather?city=${city}`;
        } else {
            // Ensure lat/lon are numbers or valid strings
            url = `/api/weather?lat=${lat}&lon=${lon}`;
        }

        console.log(`Fetching: ${url}`);
        const response = await fetch(url);
        const data = await response.json();

        if (response.status !== 200) {
            showError(data.error || 'Something went wrong');
            return;
        }

        updateUI(data);
    } catch (error) {
        console.error(error);
        showError('Network error. Is the server running?');
    }
}

function updateUI(data) {
    const { city, temp, condition, description, humidity, wind, icon } = data;

    document.getElementById('cityName').textContent = city;
    document.getElementById('temp').textContent = Math.round(temp) + '°';
    document.getElementById('condition').textContent = description;
    document.getElementById('humidity').textContent = humidity + '%';
    document.getElementById('wind').textContent = wind + 'm/s';
    document.getElementById('weatherIcon').src = icon;

    // Simple logic for Feels Like (Placeholder since API doesn't send it in this simplified endpoint)
    // We could add it to backend if needed, but for now we'll mimic it or hide it.
    const feelsLikeEl = document.getElementById('feelsLike');
    if (feelsLikeEl) {
        // Just a dummy calculation for visual completeness, or duplicate temp
        feelsLikeEl.textContent = Math.round(temp) + '°';
    }

    // Update Background
    updateBackground(condition);

    // Show Dashboard
    weatherInfo.classList.remove('hidden');
}

function updateBackground(condition) {
    body.className = ''; // Reset classes
    const cond = condition.toLowerCase();

    if (cond.includes('clear')) body.classList.add('clear');
    else if (cond.includes('cloud')) body.classList.add('clouds');
    else if (cond.includes('rain')) body.classList.add('rain');
    else if (cond.includes('drizzle')) body.classList.add('rain');
    else if (cond.includes('snow')) body.classList.add('snow');
    else if (cond.includes('thunder')) body.classList.add('thunderstorm');
    else if (cond.includes('mist') || cond.includes('fog')) body.classList.add('clouds'); // Map mist to clouds color scheme for now
}

function showError(msg) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
}
