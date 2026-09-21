// ==========================================
// WEATHER NOW
// WeatherAPI.com
// ==========================================

const API_KEY = "6e0d063ff84f4c00830172031262109";

const BASE_URL =
    "https://api.weatherapi.com/v1/current.json";


// ==========================================
// DOM ELEMENTS
// ==========================================

const searchForm =
    document.getElementById("searchForm");

const locationInput =
    document.getElementById("locationInput");

const searchBtn =
    document.getElementById("searchBtn");

const myLocationBtn =
    document.getElementById("myLocationBtn");

const loading =
    document.getElementById("loading");

const weatherContent =
    document.getElementById("weatherContent");

const errorMessage =
    document.getElementById("errorMessage");

const errorText =
    document.getElementById("errorText");


// ==========================================
// SEARCH EVENT
// ==========================================

searchForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const location =
            locationInput.value.trim();

        if (!location) {

            showError(
                "Please enter a city or location."
            );

            return;
        }

        getWeather(location);
    }
);


// ==========================================
// FETCH WEATHER
// ==========================================

async function getWeather(location) {

    showLoading();

    hideError();

    try {

        const url =
            `${BASE_URL}?key=${API_KEY}` +
            `&q=${encodeURIComponent(location)}` +
            `&aqi=yes`;

        const response =
            await fetch(url);

        const data =
            await response.json();


        // WeatherAPI error
        if (!response.ok || data.error) {

            throw new Error(
                data.error?.message ||
                "Location not found."
            );
        }


        displayWeather(data);


    } catch (error) {

        console.error(
            "Weather API Error:",
            error
        );

        showError(
            error.message ||
            "Unable to fetch weather data."
        );

    } finally {

        hideLoading();
    }
}


// ==========================================
// DISPLAY WEATHER
// ==========================================

function displayWeather(data) {

    const location =
        data.location;

    const current =
        data.current;


    // ======================================
    // LOCATION
    // ======================================

    document.getElementById(
        "cityName"
    ).textContent =
        location.name;


    document.getElementById(
        "countryName"
    ).textContent =
        `${location.region ? location.region + ", " : ""}${location.country}`;


    // ======================================
    // TIME
    // ======================================

    document.getElementById(
        "localTime"
    ).textContent =
        formatDateTime(location.localtime);


    document.getElementById(
        "lastUpdated"
    ).textContent =
        formatDateTime(current.last_updated);


    // ======================================
    // TEMPERATURE
    // ======================================

    document.getElementById(
        "temperature"
    ).textContent =
        Math.round(current.temp_c);


    document.getElementById(
        "feelsLike"
    ).textContent =
        `${Math.round(current.feelslike_c)}°C`;


    // ======================================
    // CONDITION
    // ======================================

    document.getElementById(
        "condition"
    ).textContent =
        current.condition.text;


    // ======================================
    // WEATHER ICON
    // ======================================

    document.getElementById(
        "weatherIcon"
    ).src =
        normalizeIconUrl(
            current.condition.icon
        );


    // ======================================
    // WIND
    // ======================================

    document.getElementById(
        "windSpeed"
    ).textContent =
        current.wind_kph;


    document.getElementById(
        "windDirection"
    ).textContent =
        `${current.wind_dir} (${current.wind_degree}°)`;


    // ======================================
    // HUMIDITY
    // ======================================

    document.getElementById(
        "humidity"
    ).textContent =
        current.humidity;


    document.getElementById(
        "humidityBar"
    ).style.width =
        `${current.humidity}%`;


    // ======================================
    // PRECIPITATION
    // ======================================

    document.getElementById(
        "precipitation"
    ).textContent =
        current.precip_mm;


    // ======================================
    // RAIN STATUS
    // ======================================

    updateRainStatus(current);


    // ======================================
    // UV
    // ======================================

    document.getElementById(
        "uvIndex"
    ).textContent =
        current.uv;

    document.getElementById(
        "uvStatus"
    ).textContent =
        getUVStatus(current.uv);


    // ======================================
    // VISIBILITY
    // ======================================

    document.getElementById(
        "visibility"
    ).textContent =
        current.vis_km;


    // ======================================
    // PRESSURE
    // ======================================

    document.getElementById(
        "pressure"
    ).textContent =
        current.pressure_mb;


    // ======================================
    // CLOUD
    // ======================================

    document.getElementById(
        "cloud"
    ).textContent =
        current.cloud;


    document.getElementById(
        "cloudBar"
    ).style.width =
        `${current.cloud}%`;


    // ======================================
    // AIR QUALITY
    // ======================================

    if (current.air_quality) {

        const aqi =
            current.air_quality["us-epa-index"];

        document.getElementById(
            "aqi"
        ).textContent =
            aqi ?? "--";

        document.getElementById(
            "aqiStatus"
        ).textContent =
            getAQIStatus(aqi);

    } else {

        document.getElementById(
            "aqi"
        ).textContent =
            "--";

        document.getElementById(
            "aqiStatus"
        ).textContent =
            "Unavailable";
    }


    // ======================================
    // COORDINATES
    // ======================================

    document.getElementById(
        "coordinates"
    ).textContent =
        `Coordinates: ${location.lat}, ${location.lon}`;


    // ======================================
    // TIMEZONE
    // ======================================

    document.getElementById(
        "timezone"
    ).textContent =
        `Timezone: ${location.tz_id}`;


    // ======================================
    // SUMMARY
    // ======================================

    createSummary(
        location,
        current
    );


    // ======================================
    // BACKGROUND
    // ======================================

    updateBackground(current);


    weatherContent.classList.remove(
        "hidden"
    );
}


// ==========================================
// RAIN STATUS
// ==========================================

function updateRainStatus(current) {

    const rainAlert =
        document.getElementById(
            "rainAlert"
        );

    const rainStatus =
        document.getElementById(
            "rainStatus"
        );


    const precipitation =
        Number(current.precip_mm);


    const condition =
        current.condition.text.toLowerCase();


    const isRaining =
        precipitation > 0 ||
        condition.includes("rain") ||
        condition.includes("drizzle") ||
        condition.includes("shower") ||
        condition.includes("storm");


    if (isRaining) {

        rainStatus.textContent =
            "Rain detected";

        rainAlert.style.background =
            "rgba(14, 165, 233, 0.25)";

    } else {

        rainStatus.textContent =
            "No rain currently";

        rainAlert.style.background =
            "rgba(255,255,255,0.14)";
    }
}


// ==========================================
// UV STATUS
// ==========================================

function getUVStatus(uv) {

    uv = Number(uv);

    if (uv <= 2) {
        return "Low";
    }

    if (uv <= 5) {
        return "Moderate";
    }

    if (uv <= 7) {
        return "High";
    }

    if (uv <= 10) {
        return "Very High";
    }

    return "Extreme";
}


// ==========================================
// AQI STATUS
// ==========================================

function getAQIStatus(aqi) {

    switch (Number(aqi)) {

        case 1:
            return "Good";

        case 2:
            return "Moderate";

        case 3:
            return "Unhealthy for Sensitive Groups";

        case 4:
            return "Unhealthy";

        case 5:
            return "Very Unhealthy";

        case 6:
            return "Hazardous";

        default:
            return "Unavailable";
    }
}


// ==========================================
// WEATHER SUMMARY
// ==========================================

function createSummary(
    location,
    current
) {

    const temp =
        Math.round(current.temp_c);

    const feels =
        Math.round(current.feelslike_c);

    const condition =
        current.condition.text;

    const wind =
        current.wind_kph;

    const humidity =
        current.humidity;

    const precipitation =
        current.precip_mm;


    let rainText;

    if (precipitation > 0) {

        rainText =
            ` There is currently ${precipitation} mm of precipitation.`;

    } else {

        rainText =
            " There is currently no measurable precipitation.";
    }


    const summary =
        `${location.name} is currently ${condition} with a temperature of ${temp}°C. ` +
        `It feels like ${feels}°C, with humidity at ${humidity}% and winds around ${wind} km/h.` +
        rainText;


    document.getElementById(
        "weatherSummary"
    ).textContent =
        summary;
}


// ==========================================
// DYNAMIC BACKGROUND
// ==========================================

function updateBackground(current) {

    const condition =
        current.condition.text.toLowerCase();


    if (
        condition.includes("rain") ||
        condition.includes("drizzle") ||
        condition.includes("shower") ||
        condition.includes("storm")
    ) {

        document.body.style.background =
            "radial-gradient(circle at top left, rgba(14,165,233,0.18), transparent 35%), #eef4f9";

    } else if (
        condition.includes("sunny") ||
        condition.includes("clear")
    ) {

        document.body.style.background =
            "radial-gradient(circle at top left, rgba(250,204,21,0.20), transparent 35%), #f5f7fb";

    } else if (
        condition.includes("cloud")
    ) {

        document.body.style.background =
            "radial-gradient(circle at top left, rgba(148,163,184,0.18), transparent 35%), #f3f6fb";

    } else {

        document.body.style.background =
            "#f3f6fb";
    }
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDateTime(dateString) {

    if (!dateString) {
        return "--";
    }

    const date =
        new Date(
            dateString.replace(" ", "T")
        );


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================================
// ICON URL
// ==========================================

function normalizeIconUrl(icon) {

    if (!icon) {
        return "";
    }

    if (icon.startsWith("//")) {
        return "https:" + icon;
    }

    return icon;
}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loading.classList.remove(
        "hidden"
    );

    weatherContent.classList.add(
        "hidden"
    );

    searchBtn.disabled = true;

    searchBtn.textContent =
        "Loading...";
}


function hideLoading() {

    loading.classList.add(
        "hidden"
    );

    searchBtn.disabled = false;

    searchBtn.textContent =
        "Search";
}


// ==========================================
// ERROR
// ==========================================

function showError(message) {

    errorText.textContent =
        message;

    errorMessage.classList.remove(
        "hidden"
    );
}


function hideError() {

    errorMessage.classList.add(
        "hidden"
    );
}


// ==========================================
// USE MY LOCATION
// ==========================================

myLocationBtn.addEventListener(
    "click",
    function () {

        if (!navigator.geolocation) {

            showError(
                "Geolocation is not supported by your browser."
            );

            return;
        }


        showLoading();


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                getWeather(
                    `${latitude},${longitude}`
                );
            },


            function () {

                hideLoading();

                showError(
                    "Unable to access your location. Please allow location permission."
                );
            }
        );
    }
);


// ==========================================
// ENTER KEY SEARCH
// ==========================================

locationInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchForm.requestSubmit();
        }
    }
);


// ==========================================
// INITIAL WEATHER
// ==========================================

getWeather("London");