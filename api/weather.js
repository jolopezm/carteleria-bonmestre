async function getCurrentWeather() {
    const params = new URLSearchParams({
        lat: "33.45694S",
        lon: "70.64827W",
        sections: "current",
        timezone: "auto",
        language: "en",
        units: "auto",
        key: "9v45z6vkw9qbiil8fpre1r08pui2trrtkbw39m61",
    })

    return fetch(`https://www.meteosource.com/api/v1/free/point?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error("Error fetching weather data:", error);
        throw error;
    }); 
}

export { getCurrentWeather }