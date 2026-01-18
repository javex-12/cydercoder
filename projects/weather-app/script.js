// WeatherNow - Real-time Weather App JavaScript

class WeatherApp {
    constructor() {
        this.apiKey = '9b93bd4502fe0471cdd9a9026cc574b3';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.currentUnit = 'celsius';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcomeState();
        this.updateDateTime();
        
        // Update time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    bindEvents() {
        // Search form
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchWeather();
        });

        // Location button
        document.getElementById('locationBtn').addEventListener('click', () => {
            this.getCurrentLocationWeather();
        });

        // Unit toggle buttons
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.toggleUnit(e.target.dataset.unit);
            });
        });
    }

    async searchWeather() {
        const cityInput = document.getElementById('cityInput');
        const city = cityInput.value.trim();

        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();
        
        try {
            const weatherData = await this.getWeatherData('weather', { q: city });
            const forecastData = await this.getWeatherData('forecast', { q: city });
            this.displayWeather(weatherData, forecastData);
            cityInput.value = '';
        } catch (error) {
            this.showError('Failed to get weather data', error);
        }
    }

    async getCurrentLocationWeather() {
        if (window.location.protocol !== 'https:') {
            this.showError('Geolocation is only available on secure (HTTPS) connections.');
            return;
        }

        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const weatherData = await this.getWeatherData('weather', { lat: latitude, lon: longitude });
                    const forecastData = await this.getWeatherData('forecast', { lat: latitude, lon: longitude });
                    this.displayWeather(weatherData, forecastData);
                } catch (error) {
                    this.showError('Failed to get weather data for your location', error);
                }
            },
            (error) => {
                this.showError('Unable to access your location', error);
            }
        );
    }

    async getWeatherData(endpoint, params) {
        const query = new URLSearchParams({ ...params, appid: this.apiKey, units: 'metric' });
        const url = `${this.baseUrl}/${endpoint}?${query}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`URL: ${url}, Message: ${errorData.message || 'An error occurred'}`);
        }
        
        return response.json();
    }

    displayWeather(weatherData, forecastData) {
        this.hideAllStates();
        
        // Update current weather
        document.getElementById('cityName').textContent = weatherData.name;
        document.getElementById('country').textContent = weatherData.sys.country;
        
        const tempEl = document.getElementById('temperature');
        tempEl.textContent = `${Math.round(weatherData.main.temp)}°`;
        tempEl.dataset.tempCelsius = weatherData.main.temp;

        const feelsLikeEl = document.getElementById('feelsLike');
        feelsLikeEl.textContent = `${Math.round(weatherData.main.feels_like)}°`;
        feelsLikeEl.dataset.tempCelsius = weatherData.main.feels_like;

        document.getElementById('weatherDescription').textContent = weatherData.weather[0].description;
        document.getElementById('weatherIcon').textContent = this.getWeatherIcon(weatherData.weather[0].id);
        
        // Update weather details
        document.getElementById('windSpeed').textContent = `${weatherData.wind.speed} m/s`;
        document.getElementById('humidity').textContent = `${weatherData.main.humidity}%`;
        document.getElementById('visibility').textContent = `${weatherData.visibility / 1000} km`;
        document.getElementById('pressure').textContent = `${weatherData.main.pressure} hPa`;
        
        // Update forecast and dashboard
        this.displayForecast(forecastData.list);
        this.renderHourlyForecast(forecastData.list);
        this.renderCharts(weatherData, forecastData.list);
        
        // Show weather display
        document.getElementById('weatherDisplay').classList.add('show');
    }

    renderHourlyForecast(forecastList) {
        const hourlyContainer = document.getElementById('hourlyForecastList');
        hourlyContainer.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const item = forecastList[i];
            const date = new Date(item.dt * 1000);

            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            hourlyItem.innerHTML = `
                <div class="hourly-time">${date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</div>
                <div class="hourly-icon">${this.getWeatherIcon(item.weather[0].id)}</div>
                <div class="hourly-temp">${Math.round(item.main.temp)}°</div>
            `;
            hourlyContainer.appendChild(hourlyItem);
        }
    }

    renderCharts(weatherData, forecastList) {
        this.renderTempChart(forecastList);
        this.renderWindGauge(weatherData.wind.speed);
        this.renderPressureGauge(weatherData.main.pressure);
    }

    renderTempChart(forecastList) {
        const dailyForecasts = {};
        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = { temps: [] };
            }
            dailyForecasts[date].temps.push(item.main.temp);
        });

        const labels = [];
        const highs = [];
        const lows = [];

        for (const date in dailyForecasts) {
            labels.push(new Date(date).toLocaleDateString('en-US', { weekday: 'short' }));
            highs.push(Math.round(Math.max(...dailyForecasts[date].temps)));
            lows.push(Math.round(Math.min(...dailyForecasts[date].temps)));
        }

        const ctx = document.getElementById('tempChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels.slice(0, 5),
                datasets: [
                    {
                        label: 'High',
                        data: highs.slice(0, 5),
                        borderColor: '#ff4d4d',
                        backgroundColor: 'rgba(255, 77, 77, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Low',
                        data: lows.slice(0, 5),
                        borderColor: '#00aeff',
                        backgroundColor: 'rgba(0, 174, 255, 0.2)',
                        fill: true,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { ticks: { color: '#a0a0a0' } },
                    x: { ticks: { color: '#a0a0a0' } }
                },
                plugins: { legend: { labels: { color: '#e0e0e0' } } }
            }
        });
    }

    renderWindGauge(windSpeed) {
        const ctx = document.getElementById('windGauge').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [windSpeed, 50 - windSpeed], // Assuming max wind speed of 50 for the gauge
                    backgroundColor: ['#00aeff', '#16213e'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '80%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
        });
        document.getElementById('windGaugeValue').textContent = `${windSpeed} m/s`;
    }

    renderPressureGauge(pressure) {
        const ctx = document.getElementById('pressureGauge').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [pressure - 950, 1050 - pressure], // Assuming pressure range of 950-1050 hPa
                    backgroundColor: ['#00aeff', '#16213e'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '80%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }
        });
        document.getElementById('pressureGaugeValue').textContent = `${pressure} hPa`;
    }

    getWeatherIcon(conditionId) {
        if (conditionId >= 200 && conditionId < 300) return '⛈️';
        if (conditionId >= 300 && conditionId < 400) return '🌦️';
        if (conditionId >= 500 && conditionId < 600) return '🌧️';
        if (conditionId >= 600 && conditionId < 700) return '❄️';
        if (conditionId >= 700 && conditionId < 800) return '🌫️';
        if (conditionId === 800) return '☀️';
        if (conditionId > 800) return '☁️';
        return '🤷';
    }

    toggleUnit(unit) {
        if (this.currentUnit === unit) return;
        
        this.currentUnit = unit;
        
        // Update active button
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-unit="${unit}"]`).classList.add('active');
        
        // Convert temperatures
        const tempElements = document.querySelectorAll('[data-temp-celsius]');
        tempElements.forEach(el => {
            const celsius = parseFloat(el.dataset.tempCelsius);
            if (unit === 'fahrenheit') {
                el.textContent = `${Math.round((celsius * 9/5) + 32)}°`;
            } else {
                el.textContent = `${Math.round(celsius)}°`;
            }
        });
    }

    showLoading() {
        this.hideAllStates();
        document.getElementById('loading').classList.add('show');
    }

    showError(message, error = null) {
        this.hideAllStates();
        let errorMessage = message;
        if (error) {
            errorMessage += `: ${error.message}`;
        }
        document.getElementById('errorMessage').textContent = errorMessage;
        document.getElementById('error').classList.add('show');
    }

    showWelcomeState() {
        this.hideAllStates();
        document.getElementById('welcomeState').classList.remove('hidden');
    }

    hideAllStates() {
        document.getElementById('loading').classList.remove('show');
        document.getElementById('error').classList.remove('show');
        document.getElementById('weatherDisplay').classList.remove('show');
        document.getElementById('welcomeState').classList.add('hidden');
    }

// Initialize the app
const weatherApp = new WeatherApp();

// Add some demo functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add sample cities for quick testing
    const sampleCities = ['Lagos', 'London', 'New York', 'Tokyo', 'Sydney'];
    
    // You could add quick city buttons here for demo purposes
    console.log('WeatherNow app initialized!');
    console.log('Try searching for:', sampleCities.join(', '));
});