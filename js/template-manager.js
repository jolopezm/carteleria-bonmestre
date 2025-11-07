import { logUser } from "../api/auth-service.js";
import { obtenerMenuQR } from "../api/menu-service.js";
import { getQueryStrings } from "./utils/getQueryStrings.js";
import { TEMPLATE_CONFIG } from "./utils/config.js";
import { obtenerConfigActual } from "./utils/time.js";
import { cargarTemplate, cargarTemplates } from "./utils/template-loader.js";
import {
    renderizarIntro,
    renderizarCategoria,
    renderizarDestacados,
    renderizarProductos,
} from "./utils/renderers.js";
import { iniciarRotacionFrames } from "./utils/carousel.js";

const $ = window.$;

export function generarFramesProductosPaginados(
    template,
    productos,
    config = {}
) {
    const productosPorPagina = TEMPLATE_CONFIG.PRODUCTOS_POR_PAGINA;
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);
    const frames = [];

    for (let pagina = 0; pagina < totalPaginas; pagina++) {
        frames.push({
            tipo: "productos",
            template: template,
            data: {
                productos: productos,
                paginaInicial: pagina,
            },
            config: config,
        });
    }

    return frames;
}

export async function obtenerDatosMenu() {
    try {
        const token = localStorage.getItem("jwt_token");
        const { mid = 7, sid = 61291 } = getQueryStrings();
        const menuResponse = await obtenerMenuQR(mid, sid, token);
        return menuResponse;
    } catch (error) {
        console.error("Error al obtener el menú:", error);
        return false;
    }
}

export async function inicializarCarruselFrames(frames) {
    const $container = $("#app-container");

    if (!$container.length) {
        console.error("No se encontró #app-container");
        return;
    }

    const templateNames = [...new Set(frames.map((f) => f.template))];
    const templates = await cargarTemplates(templateNames);

    const framesHTML = frames.map((frame, index) => {
        let html = "";

        switch (frame.tipo) {
            case "intro":
                html = renderizarIntro(templates[frame.template]);
                break;
            case "categoria":
                html = renderizarCategoria(
                    templates[frame.template],
                    frame.data?.nombre || "Categoría",
                    frame.config || {}
                );
                break;
            case "destacados":
                html = renderizarDestacados(
                    templates[frame.template],
                    frame.data?.productos || [],
                    frame.config || {}
                );
                break;
            case "productos":
                html = renderizarProductos(
                    templates[frame.template],
                    frame.data?.productos || [],
                    frame.data?.paginaInicial || 0,
                    frame.config || {}
                );
                break;
            default:
                console.warn(`Tipo de frame desconocido: ${frame.tipo}`);
        }

        return html;
    });

    $container.html(framesHTML.join(""));

    iniciarRotacionFrames();
}

export async function main(categoriasAMostrar = null) {
    try {
        await logUser();

        const menuData = await obtenerDatosMenu();

        if (!menuData || !menuData.productos) {
            throw new Error("No se pudieron cargar los datos del menú");
        }

        const platos = menuData.productos;
        const list = {};
        console.log("Menú cargado:", menuData);

        // ✅ Agrupar productos por categoría
        platos.forEach((plato) => {
            const categoria = plato.categoria;

            if (!list[categoria]) {
                list[categoria] = [];
            }

            list[categoria].push({
                nombre: plato.producto_descr, // ← Cambio: producto_descr
                descripcion: plato.producto_detalle, // ← Cambio: producto_detalle
                precio: plato.precio,
                img: plato.imagen_url, // ← Cambio: imagen_url
                id: plato.id_producto,
            });
        });

        console.log("Menú estructurado por categorías:", list);

        const config = obtenerConfigActual();

        // ✅ Usar las categorías del objeto agrupado
        const categorias = categoriasAMostrar || Object.keys(list);

        console.log("Categorías a mostrar:", categorias);

        const frames = [];

        frames.push({
            tipo: "intro",
            template: "intro",
        });

        categorias.forEach((categoria) => {
            // ✅ CORRECCIÓN: Usar 'list' en lugar de 'platos'
            const productosCategoria = list[categoria] || [];

            console.log(
                `Procesando categoría "${categoria}": ${productosCategoria.length} productos`
            );

            if (productosCategoria.length > 0) {
                frames.push({
                    tipo: "categoria",
                    template: "categoria",
                    data: { nombre: categoria },
                    config: config,
                });

                if (productosCategoria.length >= 3) {
                    frames.push({
                        tipo: "destacados",
                        template: "destacados",
                        data: {
                            productos: productosCategoria.slice(0, 3),
                        },
                        config: config,
                    });
                }

                frames.push(
                    ...generarFramesProductosPaginados(
                        "productos",
                        productosCategoria,
                        {
                            ...config,
                            eyebrow: `Nuestro menú de ${categoria}`,
                        }
                    )
                );
            }
        });

        console.log(
            `✅ ${frames.length} frames generados para ${categorias.length} categorías`
        );

        console.log(
            "Frames generados:",
            frames.map((f) => f.tipo)
        );

        await inicializarCarruselFrames(frames);

        console.log("🎬 Carrusel iniciado correctamente");
    } catch (error) {
        console.error("❌ Error al inicializar la cartelería:", error);
        throw error;
    }
}

export {
    inicializarCarruselFrames as default,
    obtenerConfigActual,
    cargarTemplate,
    cargarTemplates,
};
