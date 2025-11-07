const $ = window.$;

const TEMPLATE_CONFIG = {
    TEMPLATE_DIR: "./templates/",
    INTERVALO_FRAMES: 5000,
    DURACION_FADE: 600,
    INTERVALO_PRODUCTOS: 1000,
    DURACION_FADE_PRODUCTO: 400,
    PRODUCTOS_POR_PAGINA: 6,
};

async function cargarTemplate(templateName) {
    try {
        const response = await fetch(
            `${TEMPLATE_CONFIG.TEMPLATE_DIR}${templateName}.html`
        );
        if (!response.ok) {
            throw new Error(`Template ${templateName} no encontrado`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error cargando template ${templateName}:`, error);
        throw error;
    }
}

async function cargarTemplates(templateNames) {
    const templates = {};
    const promesas = templateNames.map(async (name) => {
        templates[name] = await cargarTemplate(name);
    });
    await Promise.all(promesas);
    return templates;
}

function renderizarIntro(templateHTML) {
    return templateHTML;
}

function renderizarCategoria(templateHTML, categoriaNombre, config = {}) {
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

function renderizarDestacados(templateHTML, productos, config = {}) {
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

function renderizarProductos(
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

let intervalosActivos = [];
let intervaloFrames = null;

function limpiarIntervalos() {
    intervalosActivos.forEach((intervalo) => clearInterval(intervalo));
    intervalosActivos = [];
}

function pausarCarruselFrames() {
    if (intervaloFrames) {
        clearInterval(intervaloFrames);
        intervaloFrames = null;
    }
}

function reanudarCarruselFrames(callback) {
    if (!intervaloFrames) {
        intervaloFrames = setInterval(
            callback,
            TEMPLATE_CONFIG.INTERVALO_FRAMES
        );
    }
}

function iniciarRotacionProductos($frame, onComplete) {
    const $menuList = $frame.find(".menu-list");
    console.log("cantidad de items:", $menuList.find(".item").length);
    const $items = $menuList.find(".item");
    console.log("items:", $items);
    const $imgDestacada = $frame.find(".producto-img-destacada");

    if ($items.length <= 1) {
        if (onComplete) onComplete();
        return;
    }

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

async function inicializarCarruselFrames(frames) {
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

function iniciarRotacionFrames() {
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

        if (frameActual === 0) {
            ciclosCompletados++;

            setTimeout(() => {
                location.reload();
            }, TEMPLATE_CONFIG.INTERVALO_FRAMES);
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

function obtenerHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function obtenerConfigActual() {
    return {
        hora: obtenerHoraActual(),
        temperatura: 31,
    };
}

function generarFramesProductosPaginados(template, productos, config = {}) {
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

async function main() {
    const response = await fetch("./data/platos.json");
    const platos = await response.json();

    const config = obtenerConfigActual();

    const frames = [
        {
            tipo: "intro",
            template: "intro",
        },
        {
            tipo: "categoria",
            template: "categoria",
            data: { nombre: "Desayunos" },
            config: config,
        },
        {
            tipo: "destacados",
            template: "destacados",
            data: {
                productos: (platos["Desayunos"] || []).slice(0, 3),
            },
            config: config,
        },
        ...generarFramesProductosPaginados(
            "productos",
            platos["Desayunos"] || [],
            { ...config, eyebrow: "Nuestros Desayunos" }
        ),
    ];

    await inicializarCarruselFrames(frames);
}

export {
    inicializarCarruselFrames,
    cargarTemplate,
    cargarTemplates,
    renderizarIntro,
    renderizarCategoria,
    renderizarDestacados,
    renderizarProductos,
    obtenerConfigActual,
    generarFramesProductosPaginados,
    main,
};
