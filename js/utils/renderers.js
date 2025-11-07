/**
 * Funciones de renderizado de templates
 */
import { TEMPLATE_CONFIG } from "./config.js";

/**
 * Renderiza el template de introducción
 * @param {string} templateHTML - HTML del template
 * @returns {string} HTML renderizado
 */
export function renderizarIntro(templateHTML) {
    return templateHTML;
}

/**
 * Renderiza el template de categoría
 * @param {string} templateHTML - HTML del template
 * @param {string} categoriaNombre - Nombre de la categoría
 * @param {Object} config - Configuración (hora, temperatura)
 * @returns {string} HTML renderizado
 */
export function renderizarCategoria(
    templateHTML,
    categoriaNombre,
    config = {}
) {
    let html = templateHTML;

    html = html.replace(
        /<h1 class="title">.*?<\/h1>/,
        `<h1 class="title">${categoriaNombre}</h1>`
    );

    if (config.hora) {
        html = html.replace(
            /<span>17:39<\/span>/g,
            `<span>${config.hora}</span>`
        );
    }
    if (config.temperatura) {
        html = html.replace(
            /<span>31°<\/span>/g,
            `<span>${config.temperatura}°</span>`
        );
    }

    return html;
}

/**
 * Renderiza el template de productos destacados
 * @param {string} templateHTML - HTML del template
 * @param {Array<Object>} productos - Array de productos
 * @param {Object} config - Configuración (hora, temperatura)
 * @returns {string} HTML renderizado
 */
export function renderizarDestacados(templateHTML, productos, config = {}) {
    let html = templateHTML;

    const cardsHTML = productos
        .slice(0, 3)
        .map(
            (producto) => `
        <article class="card">
            <div class="img-wrap ring-gold cut-top-left">
                <img
                    src="${producto.img || ""}"
                    alt="${producto.nombre || ""}" />
            </div>
            <h3 class="name">${producto.nombre || ""}</h3>
            <p class="desc">
                ${producto.descripcion || ""}
            </p>
            <div class="price-tag">$${
                producto.precio ? producto.precio.toLocaleString() : ""
            }</div>
        </article>
    `
        )
        .join("");

    html = html.replace(
        /<div class="cards">[\s\S]*?<\/div>\s*<\/main>/,
        `<div class="cards">${cardsHTML}</div></main>`
    );

    if (config.hora) {
        html = html.replace(
            /<span>17:39<\/span>/g,
            `<span>${config.hora}</span>`
        );
    }
    if (config.temperatura) {
        html = html.replace(
            /<span>31°<\/span>/g,
            `<span>${config.temperatura}°</span>`
        );
    }

    return html;
}

/**
 * Renderiza el template de lista de productos (paginado)
 * @param {string} templateHTML - HTML del template
 * @param {Array<Object>} productos - Array de productos
 * @param {number} paginaInicial - Página a mostrar (0-indexed)
 * @param {Object} config - Configuración (hora, temperatura, eyebrow)
 * @returns {string} HTML renderizado
 */
export function renderizarProductos(
    templateHTML,
    productos,
    paginaInicial = 0,
    config = {}
) {
    let html = templateHTML;

    const productosPorPagina = TEMPLATE_CONFIG.PRODUCTOS_POR_PAGINA;
    const totalPaginas = Math.ceil(productos.length / productosPorPagina);

    const inicio = paginaInicial * productosPorPagina;
    const fin = Math.min(inicio + productosPorPagina, productos.length);
    const productosVisibles = productos.slice(inicio, fin);

    const productoDestacado = productosVisibles[0] || productos[0];

    html = html.replace(
        /<figure class="photo">[\s\S]*?<\/figure>/,
        `<figure class="photo">
            <img src="${productoDestacado.img || ""}" alt="${
            productoDestacado.nombre || ""
        }" class="producto-img-destacada" />
        </figure>`
    );

    const listaHTML = productosVisibles
        .map((producto, indexLocal) => {
            const indexGlobal = inicio + indexLocal;
            return `
        <div class="item ${
            indexLocal === 0 ? "active" : ""
        }" data-producto-index="${indexGlobal}" data-producto-img="${
                producto.img || ""
            }">
            <div class="left">
                <span class="dot"></span>
                <span class="name">${producto.nombre || ""}</span>
            </div>
            <span class="price">$${
                producto.precio ? producto.precio.toLocaleString() : ""
            }</span>
        </div>
    `;
        })
        .join("");

    html = html.replace(
        /<div class="menu-list">[\s\S]*?<\/div>\s*<\/section>/,
        `<div class="menu-list" 
            data-total-productos="${productos.length}"
            data-productos-por-pagina="${productosPorPagina}"
            data-total-paginas="${totalPaginas}"
            data-pagina-actual="${paginaInicial}"
        >${listaHTML}</div></section>`
    );

    if (config.hora) {
        html = html.replace(
            /<span>17:39<\/span>/g,
            `<span>${config.hora}</span>`
        );
    }
    if (config.temperatura) {
        html = html.replace(
            /<span>31°<\/span>/g,
            `<span>${config.temperatura}°</span>`
        );
    }

    if (config.eyebrow) {
        html = html.replace(
            /<div class="eyebrow">.*?<\/div>/,
            `<div class="eyebrow">${config.eyebrow}</div>`
        );
    }

    return html;
}
