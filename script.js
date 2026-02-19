const apiKey = 'a19f78653ecc9de1871ae341fa0afc38';
const apiUrl = 'http://api.weatherstack.com/current';

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

async function getWeather(city) {
    // Show loading state
    loading.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    errorMessage.classList.remove('visible');
    errorMessage.style.display = 'none';

    try {
        const response = await fetch(`${apiUrl}?access_key=${apiKey}&query=${encodeURIComponent(city)}`);
        const data = await response.json();

        // Check for API-specific errors (Weatherstack returns 200 even on error)
        if (data.error) {
            throw new Error(data.error.info);
        }

        updateWeatherUI(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError();
    } finally {
        loading.classList.add('hidden');
    }
}

function updateWeatherUI(data) {
    const { location, current } = data;

    // Update Location
    document.getElementById('city-name').textContent = location.name;
    document.getElementById('country-name').textContent = location.country;
    document.getElementById('local-time').textContent = `Local Time: ${location.localtime}`;

    // Update Weather Info
    document.getElementById('temperature').textContent = current.temperature;
    document.getElementById('weather-desc').textContent = current.weather_descriptions[0];
    document.getElementById('weather-icon').src = current.weather_icons[0];
    document.getElementById('weather-icon').alt = current.weather_descriptions[0];

    // Update Details
    document.getElementById('humidity').textContent = `${current.humidity}%`;
    document.getElementById('wind-speed').textContent = `${current.wind_speed} km/h`;
    document.getElementById('feels-like').textContent = `${current.feelslike}°C`;

    // Show the weather info section
    weatherInfo.classList.remove('hidden');
}

function showError() {
    errorMessage.style.display = 'block';
    errorMessage.classList.add('visible');
    weatherInfo.classList.add('hidden');
}
