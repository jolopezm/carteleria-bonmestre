const CONFIG = {
    TEMPLATE_DIR: "./templates/",
    INTERVALO_FRAMES: 3000,
    DURACION_FADE: 600,
    INTERVALO_PRODUCTOS: 5000,
    DURACION_FADE_PRODUCTO: 400,
    PRODUCTOS_POR_PAGINA: 6, 
}

const PATHS = {
    TEMPLATES: "./templates/",
}

const API_URLS = {
    WEATHER_API: "https://www.meteosource.com/api/v1/free/point",
}

const WEATHER_PARAMS = {
    LATITUDE: "33.45694S",
    LONGITUDE: "70.64827W",
    SECTIONS: "current",
    TIMEZONE: "auto",
    LANGUAGE: "en",
    UNITS: "auto",
    API_KEY: "9v45z6vkw9qbiil8fpre1r08pui2trrtkbw39m61",
}

export { CONFIG, PATHS, API_URLS, WEATHER_PARAMS }