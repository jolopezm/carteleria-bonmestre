import { CONFIG } from "../constants.js"

const $ = window.$

let intervalosActivos = []
let intervaloFrames = null

function limpiarIntervalos() {
    intervalosActivos.forEach((intervalo) => clearInterval(intervalo))
    intervalosActivos = []
}

function pausarCarruselFrames() {
    if (intervaloFrames) {
        clearInterval(intervaloFrames)
        intervaloFrames = null
    }
}

function reanudarCarruselFrames(callback) {
    if (!intervaloFrames) {
        intervaloFrames = setInterval(callback, CONFIG.INTERVALO_FRAMES)
    }
}

function iniciarRotacionProductos($frame, onComplete) {
    const $menuList = $frame.find(".menu-list")
    const $items = $menuList.find(".item")
    const $imgDestacada = $frame.find(".producto-img-destacada")

    if ($items.length <= 1) {
        if (onComplete) onComplete()
        return
    }

    $items.removeClass("active")
    $items.eq(0).addClass("active")

    const primeraImg = $items.eq(0).data("producto-img")
    $imgDestacada.attr("src", primeraImg)

    let indiceActual = 0
    let productosIterados = 1

    const intervalo = setInterval(() => {
        $items.removeClass("active")

        indiceActual = (indiceActual + 1) % $items.length
        productosIterados++

        const $itemSiguiente = $items.eq(indiceActual)

        $imgDestacada.fadeOut(CONFIG.DURACION_FADE_PRODUCTO, function () {
            const nuevaImg = $itemSiguiente.data("producto-img")
            $(this).attr("src", nuevaImg)
            $itemSiguiente.addClass("active")
            $(this).fadeIn(CONFIG.DURACION_FADE_PRODUCTO)
        })

        if (productosIterados >= $items.length) {
            clearInterval(intervalo)
            limpiarIntervalos()

            if (onComplete) {
                setTimeout(onComplete, 500)
            }
        }
    }, CONFIG.INTERVALO_PRODUCTOS)

    intervalosActivos.push(intervalo)
}

function iniciarRotacionFrames() {
    const $frames = $(".frame")
    let frameActual = 0
    let ciclosCompletados = 0

    function avanzarFrame() {
        const $frameActual = $frames.eq(frameActual)
        limpiarIntervalos()

        $frameActual.removeClass("is-active").slideUp(CONFIG.DURACION_FADE)

        frameActual = (frameActual + 1) % $frames.length

        if (frameActual === 0) {
            ciclosCompletados++
        }

        const $nuevoFrame = $frames.eq(frameActual)

        $nuevoFrame
            .addClass("is-active")
            .slideDown(CONFIG.DURACION_FADE, function () {
                if ($nuevoFrame.find(".menu-list").length) {
                    pausarCarruselFrames()

                    iniciarRotacionProductos($nuevoFrame, function () {
                        reanudarCarruselFrames(avanzarFrame)
                    })
                }
            })
    }

    const $primerFrame = $frames.eq(frameActual)
    $primerFrame.addClass("is-active").fadeIn(CONFIG.DURACION_FADE)

    if ($primerFrame.find(".menu-list").length) {
        iniciarRotacionProductos($primerFrame, function () {
            intervaloFrames = setInterval(avanzarFrame, CONFIG.INTERVALO_FRAMES)
        })
    } else {
        intervaloFrames = setInterval(avanzarFrame, CONFIG.INTERVALO_FRAMES)
    }
}

export {
    limpiarIntervalos,
    pausarCarruselFrames,
    reanudarCarruselFrames,
    iniciarRotacionProductos,
    iniciarRotacionFrames,
}
