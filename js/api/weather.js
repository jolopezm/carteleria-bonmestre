import { API_URLS, WEATHER_PARAMS } from "../constants.js"

async function getCurrentWeather() {
    const params = new URLSearchParams({
        lat: WEATHER_PARAMS.LATITUDE,
        lon: WEATHER_PARAMS.LONGITUDE,
        sections: WEATHER_PARAMS.SECTIONS,
        timezone: WEATHER_PARAMS.TIMEZONE,
        language: WEATHER_PARAMS.LANGUAGE,
        units: WEATHER_PARAMS.UNITS,
        key: WEATHER_PARAMS.API_KEY,
    })

    return fetch(`${API_URLS.WEATHER}?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            return response.json()
        })
        .then((data) => {
            return data
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error)
            throw error
        })
}

export { getCurrentWeather }
