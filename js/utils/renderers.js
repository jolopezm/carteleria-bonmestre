import { TEMPLATE_CONFIG } from "./config.js"

function truncarTexto(texto, maxLength) {
    if (!texto || texto.length <= maxLength) return texto

    const truncado = texto.substring(0, maxLength)
    const ultimoEspacio = truncado.lastIndexOf(" ")

    return ultimoEspacio > 0
        ? truncado.substring(0, ultimoEspacio) + "..."
        : truncado + "..."
}

export function renderizarIntro(templateHTML) {
    return templateHTML
}

export function renderizarCategoria(
    templateHTML,
    categoriaNombre,
    config = {}
) {
    let html = templateHTML

    html = html.replace(
        /<h1 class="title">.*?<\/h1>/,
        `<h1 class="title">${categoriaNombre}</h1>`
    )

    if (config.hora) {
        html = html.replace(
            /<span>17:39<\/span>/g,
            `<span>${config.hora}</span>`
        )
    }
    if (config.temperatura) {
        html = html.replace(
            /<span>31°<\/span>/g,
            `<span>${config.temperatura}°</span>`
        )
    }

    return html
}

export function renderizarDestacados(templateHTML, productos, config = {}) {
    let html = templateHTML

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
                ${truncarTexto(producto.descripcion || "", 80)}
            </p>
            <div class="price-tag">$${
                producto.precio ? producto.precio.toLocaleString("es-CL") : ""
            }</div>
        </article>
    `
        )
        .join("")

    html = html.replace(
        /<div class="cards">[\s\S]*?<\/div>\s*<\/main>/,
        `<div class="cards">${cardsHTML}</div></main>`
    )

    if (config.hora) {
        html = html.replace(
            /<span>17:39<\/span>/g,
            `<span>${config.hora}</span>`
        )
    }
    if (config.temperatura) {
        html = html.replace(
            /<span>31°<\/span>/g,
            `<span>${config.temperatura}°</span>`
        )
    }

    return html
}

export function renderizarProductos(
    templateHTML,
    productos,
    paginaInicial = 0,
    config = {}
) {
    let html = templateHTML

    const productosPorPagina = TEMPLATE_CONFIG.PRODUCTOS_POR_PAGINA
    const totalPaginas = Math.ceil(productos.length / productosPorPagina)

    const inicio = paginaInicial * productosPorPagina
    const fin = Math.min(inicio + productosPorPagina, productos.length)
    const productosVisibles = productos.slice(inicio, fin)

    const productoDestacado = productosVisibles[0] || productos[0]

    html = html.replace(
        /<figure class="photo">[\s\S]*?<\/figure>/,
        `<figure class="photo">
            <img src="${productoDestacado.img || ""}" alt="${
            productoDestacado.nombre || ""
        }" class="producto-img-destacada" />
        </figure>`
    )

    const listaHTML = productosVisibles
        .map((producto, indexLocal) => {
            const indexGlobal = inicio + indexLocal
            return `
        <div class="item ${
            indexLocal === 0 ? "active" : ""
        }" data-producto-index="${indexGlobal}" data-producto-img="${
                producto.img || ""
            }">
            <div class="left">
                <span class="dot"></span>
                <span class="name">${truncarTexto(
                    producto.nombre || "",
                    60
                )}</span>
            </div>
            <span class="price">$${
                producto.precio ? producto.precio.toLocaleString("es-CL") : ""
            }</span>
        </div>
    `
        })
        .join("")

    html = html.replace(
        /<div class="menu-list">[\s\S]*?<\/div>\s*<\/section>/,
        `<div class="menu-list" 
            data-total-productos="${productos.length}"
            data-productos-por-pagina="${productosPorPagina}"
            data-total-paginas="${totalPaginas}"
            data-pagina-actual="${paginaInicial}"
        >${listaHTML}</div></section>`
    )

    return html
}
