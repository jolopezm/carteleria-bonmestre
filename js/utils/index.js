import { obtenerHoraActual, obtenerConfigActual, getCount } from "./time.js"
import { getQueryStrings } from "./getQueryStrings.js"
import { cargarTemplate, cargarTemplates } from "./templateLoader.js"
import {
    renderizarIntro,
    renderizarCategoria,
    renderizarDestacados,
    renderizarProductos,
} from "./renderers.js"
import {
    limpiarIntervalos,
    pausarCarruselFrames,
    reanudarCarruselFrames,
    iniciarRotacionProductos,
    iniciarRotacionFrames,
} from "./carousel.js"

export {
    obtenerHoraActual,
    obtenerConfigActual,
    getCount,
    getQueryStrings,
    cargarTemplate,
    cargarTemplates,
    renderizarIntro,
    renderizarCategoria,
    renderizarDestacados,
    renderizarProductos,
    limpiarIntervalos,
    pausarCarruselFrames,
    reanudarCarruselFrames,
    iniciarRotacionProductos,
    iniciarRotacionFrames,
}
