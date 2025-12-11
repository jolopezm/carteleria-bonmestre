import { obtenerMenuQR, logUser, getCurrentWeather } from "./api/index.js"
import {
    obtenerConfigActual,
    getQueryStrings,
    cargarTemplates,
    renderizarIntro,
    renderizarCategoria,
    renderizarDestacados,
    renderizarProductos,
    iniciarRotacionFrames,
} from "./utils/index.js"
import { CONFIG } from "./constants.js"

const $ = window.$

function generarFramesProductosPaginados(template, productos, config = {}) {
    const productosPorPagina = CONFIG.PRODUCTOS_POR_PAGINA
    const totalPaginas = Math.ceil(productos.length / productosPorPagina)
    const frames = []

    for (let pagina = 0; pagina < totalPaginas; pagina++) {
        frames.push({
            tipo: "productos",
            template: template,
            data: {
                productos: productos,
                paginaInicial: pagina,
            },
            config: config,
        })
    }

    return frames
}

async function obtenerDatosMenu() {
    try {
        const token = localStorage.getItem("jwt_token")
        const { mid = 7, sid = 61291 } = getQueryStrings()
        const menuResponse = await obtenerMenuQR(mid, sid, token)
        return menuResponse
    } catch (error) {
        console.error("Error al obtener el menú:", error)
        return false
    }
}

function actualizarHora(weatherData) {
    const $horaElemento = $(".time-badge #hora")
    const $temperaturaElemento = $(".time-badge #temperatura")
    if (!$horaElemento.length) {
        console.warn("El elemento #hora no se encontró en el DOM.")
        return
    }

    const horaActual = new Date().toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })

    if (weatherData && weatherData.current) {
        const temperatura = Math.round(weatherData.current.temperature)
        $temperaturaElemento.text(`${temperatura}°`)
    }

    $horaElemento.text(horaActual)
}

async function inicializarCarruselFrames(frames) {
    const $container = $("#app-container")

    if (!$container.length) {
        console.error("No se encontró #app-container")
        return
    }

    const templateNames = [...new Set(frames.map((f) => f.template))]
    const templates = await cargarTemplates(templateNames)

    const framesHTML = frames.map((frame, index) => {
        let html = ""

        switch (frame.tipo) {
            case "intro":
                html = renderizarIntro(templates[frame.template])
                break
            case "categoria":
                html = renderizarCategoria(
                    templates[frame.template],
                    frame.data?.nombre || "Categoría",
                    frame.config || {}
                )
                break
            case "destacados":
                html = renderizarDestacados(
                    templates[frame.template],
                    frame.data?.productos || [],
                    frame.config || {}
                )
                break
            case "productos":
                html = renderizarProductos(
                    templates[frame.template],
                    frame.data?.productos || [],
                    frame.data?.paginaInicial || 0,
                    frame.config || {}
                )
                break
            default:
                console.warn(`Tipo de frame desconocido: ${frame.tipo}`)
        }

        return html
    })

    $container.html(framesHTML.join(""))

    iniciarRotacionFrames()
}

async function main(categoriasAMostrar = null) {
    try {
        await logUser()
        let weatherData = await getCurrentWeather()

        const transformarCategoria = (categoria) => {
            switch (categoria) {
                case "Desayuno y Tostadas":
                    return "Desayunos y Tostadas"
                case "Pasteleria":
                    return "Pastelería"
                case "Cafeteria":
                    return "Cafetería"
                default:
                    return categoria
            }
        }

        if (categoriasAMostrar) {
            categoriasAMostrar = categoriasAMostrar.map(transformarCategoria)
        }

        let menuData = await obtenerDatosMenu()
        let platos

        if (!menuData || !menuData.productos) {
            console.warn(
                "No se pudo obtener el menú de la API. Cargando datos locales..."
            )

            try {
                const response = await fetch("./data/platos.json")
                const datosLocales = await response.json()

                platos = []
                Object.entries(datosLocales).forEach(
                    ([categoria, productos]) => {
                        productos.forEach((producto) => {
                            platos.push({
                                categoria: categoria,
                                producto_descr: producto.nombre,
                                producto_detalle: producto.descripcion || "",
                                precio: producto.precio,
                                imagen_url: producto.img,
                                id_producto: producto.id || Math.random(),
                            })
                        })
                    }
                )
            } catch (errorLocal) {
                throw new Error(
                    "No se pudo cargar el menú desde la API ni desde el archivo local"
                )
            }
        } else {
            platos = menuData.productos.map((producto) => ({
                ...producto,
                categoria: transformarCategoria(producto.categoria),
            }))
        }

        const list = {}
        platos.forEach((plato) => {
            const categoria = plato.categoria

            if (!list[categoria]) {
                list[categoria] = []
            }

            list[categoria].push({
                nombre: plato.producto_descr,
                descripcion: plato.producto_detalle,
                precio: plato.precio,
                img: plato.imagen_url,
                id: plato.id_producto,
            })
        })

        const config = obtenerConfigActual()
        let categorias = categoriasAMostrar || Object.keys(list)
        const frames = []

        frames.push({
            tipo: "intro",
            template: "intro",
        })

        categorias.forEach((categoria) => {
            const productosCategoria = list[categoria] || []

            if (productosCategoria.length > 0) {
                frames.push({
                    tipo: "categoria",
                    template: "categoria",
                    data: { nombre: categoria },
                    config: config,
                })

                if (productosCategoria.length >= 3) {
                    frames.push({
                        tipo: "destacados",
                        template: "destacados",
                        data: {
                            productos: productosCategoria.slice(0, 3),
                        },
                        config: config,
                    })
                }

                frames.push(
                    ...generarFramesProductosPaginados(
                        "productos",
                        productosCategoria,
                        {
                            ...config,
                            eyebrow: `${categoria}`,
                        }
                    )
                )
            }
        })

        await inicializarCarruselFrames(frames)

        setInterval(async () => {
            weatherData = await getCurrentWeather()
        }, 600000)

        setInterval(() => {
            actualizarHora(weatherData)
        }, 1000)
    } catch (error) {
        console.error("Error al inicializar la cartelería:", error)
        throw error
    }
}

export {
    obtenerDatosMenu,
    generarFramesProductosPaginados,
    main,
    actualizarHora,
    inicializarCarruselFrames,
}
