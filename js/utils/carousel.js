/**
 * Lógica del carrusel de frames y productos
 */
import { TEMPLATE_CONFIG } from "./config.js";

const $ = window.$;

let intervalosActivos = [];
let intervaloFrames = null;

/**
 * Limpia todos los intervalos activos de rotación de productos
 */
export function limpiarIntervalos() {
    intervalosActivos.forEach((intervalo) => clearInterval(intervalo));
    intervalosActivos = [];
}

/**
 * Pausa el carrusel principal de frames
 */
export function pausarCarruselFrames() {
    if (intervaloFrames) {
        clearInterval(intervaloFrames);
        intervaloFrames = null;
    }
}

/**
 * Reanuda el carrusel principal de frames
 * @param {Function} callback - Función a ejecutar en cada intervalo
 */
export function reanudarCarruselFrames(callback) {
    if (!intervaloFrames) {
        intervaloFrames = setInterval(
            callback,
            TEMPLATE_CONFIG.INTERVALO_FRAMES
        );
    }
}

/**
 * Inicia la rotación de productos dentro de un frame
 * @param {jQuery} $frame - Frame jQuery que contiene los productos
 * @param {Function} onComplete - Callback cuando termina la rotación
 */
export function iniciarRotacionProductos($frame, onComplete) {
    const $menuList = $frame.find(".menu-list");
    const $items = $menuList.find(".item");
    const $imgDestacada = $frame.find(".producto-img-destacada");

    if ($items.length <= 1) {
        if (onComplete) onComplete();
        return;
    }

    // Resetear al estado inicial
    $items.removeClass("active");
    $items.eq(0).addClass("active");

    const primeraImg = $items.eq(0).data("producto-img");
    $imgDestacada.attr("src", primeraImg);

    let indiceActual = 0;
    let productosIterados = 1;

    const intervalo = setInterval(() => {
        $items.removeClass("active");

        indiceActual = (indiceActual + 1) % $items.length;
        productosIterados++;

        const $itemSiguiente = $items.eq(indiceActual);

        $imgDestacada.fadeOut(
            TEMPLATE_CONFIG.DURACION_FADE_PRODUCTO,
            function () {
                const nuevaImg = $itemSiguiente.data("producto-img");
                $(this).attr("src", nuevaImg);
                $(this).fadeIn(TEMPLATE_CONFIG.DURACION_FADE_PRODUCTO);
            }
        );

        $itemSiguiente.addClass("active");

        if (productosIterados >= $items.length) {
            clearInterval(intervalo);
            limpiarIntervalos();

            if (onComplete) {
                setTimeout(onComplete, 500);
            }
        }
    }, TEMPLATE_CONFIG.INTERVALO_PRODUCTOS);

    intervalosActivos.push(intervalo);
}

/**
 * Inicia el carrusel principal de frames
 * Incluye lógica de recarga automática al completar un ciclo
 */
export function iniciarRotacionFrames() {
    const $frames = $(".frame");
    let frameActual = 0;
    let ciclosCompletados = 0;

    function avanzarFrame() {
        const $frameActual = $frames.eq(frameActual);
        limpiarIntervalos();

        $frameActual
            .removeClass("is-active")
            .slideUp(TEMPLATE_CONFIG.DURACION_FADE);

        frameActual = (frameActual + 1) % $frames.length;

        // Detectar ciclo completo y recargar
        if (frameActual === 0) {
            ciclosCompletados++;
            setTimeout(() => {
                location.reload();
            }, TEMPLATE_CONFIG.INTERVALO_FRAMES);
            return;
        }

        const $nuevoFrame = $frames.eq(frameActual);

        $nuevoFrame
            .addClass("is-active")
            .slideDown(TEMPLATE_CONFIG.DURACION_FADE, function () {
                if ($nuevoFrame.find(".menu-list").length) {
                    pausarCarruselFrames();

                    iniciarRotacionProductos($nuevoFrame, function () {
                        reanudarCarruselFrames(avanzarFrame);
                    });
                }
            });
    }

    const $primerFrame = $frames.eq(frameActual);
    $primerFrame.addClass("is-active").fadeIn(TEMPLATE_CONFIG.DURACION_FADE);

    if ($primerFrame.find(".menu-list").length) {
        iniciarRotacionProductos($primerFrame, function () {
            intervaloFrames = setInterval(
                avanzarFrame,
                TEMPLATE_CONFIG.INTERVALO_FRAMES
            );
        });
    } else {
        intervaloFrames = setInterval(
            avanzarFrame,
            TEMPLATE_CONFIG.INTERVALO_FRAMES
        );
    }
}
