const CONFIG = {
    PRODUCTOS_POR_PAGINA: 2,
    INTERVALO_CARRUSEL: 5000,
    DURACION_FADE_OUT: 500,
    DURACION_FADE_IN: 800,
    RUTA_DATOS: "./data/platos.json",
    PAGINA_DESTINO: "pasteleria.html",
    CATEGORIAS_DEFECTO: null,
};

async function obtenerPlatos() {
    try {
        const response = await fetch(CONFIG.RUTA_DATOS);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al cargar el archivo JSON:", error);
        throw error;
    }
}

function obtenerCategorias(platos, categoriasFiltro = null) {
    const todasLasCategorias = Object.keys(platos);

    if (!categoriasFiltro || categoriasFiltro.length === 0) {
        return todasLasCategorias;
    }

    return categoriasFiltro.filter((categoria) =>
        todasLasCategorias.includes(categoria)
    );
}

function mostrarProductosDeCategoria(
    categoria,
    platos,
    productoIndex,
    productosPorPagina
) {
    const $container = $("#container-productos");
    const $titulo = $("#categoria");

    if (!$container.length || !$titulo.length) {
        console.error("No se encontraron los elementos del DOM necesarios");
        return;
    }

    $container.fadeOut(CONFIG.DURACION_FADE_OUT, function () {
        $titulo.text(categoria);

        const productosCategoria = platos[categoria] || [];
        const productosAMostrar = productosCategoria.slice(
            productoIndex,
            productoIndex + productosPorPagina
        );

        const html = productosAMostrar
            .map(
                (producto) => `
                <div class="producto">
                    <img 
                        class="producto-img" 
                        src="${producto.img || ""}" 
                        alt="${producto.alt || producto.nombre || ""}" 
                        data-nombre="${producto.nombre || ""}"
                    />
                    <h2>${producto.nombre || "Sin nombre"}</h2>
                    <p class="descripcion">${producto.descripcion || ""}</p>
                    <p class="precio">${
                        producto.precio
                            ? "$" + producto.precio.toLocaleString()
                            : ""
                    }</p>
                </div>
            `
            )
            .join("");

        $container.html(html);

        agregarEventosImagenes();
        $container.fadeIn(CONFIG.DURACION_FADE_IN);
    });
}

function agregarEventosImagenes() {
    $(".producto-img").each(function () {
        $(this)
            .css("cursor", "pointer")
            .on("click", function () {
                redirigirAPasteleria();
            });
    });
}

function redirigirAPasteleria() {
    window.location.href = CONFIG.PAGINA_DESTINO;
}

function iniciarCarruselCategorias(
    categorias,
    platos,
    productosPorPagina = CONFIG.PRODUCTOS_POR_PAGINA
) {
    let categoriaIndex = 0;
    let productoIndex = 0;

    function mostrarSiguiente() {
        const categoriaActual = categorias[categoriaIndex];
        const productosCategoria = platos[categoriaActual] || [];

        mostrarProductosDeCategoria(
            categoriaActual,
            platos,
            productoIndex,
            productosPorPagina
        );

        productoIndex += productosPorPagina;
        if (productoIndex >= productosCategoria.length) {
            productoIndex = 0;
            categoriaIndex = (categoriaIndex + 1) % categorias.length;
        }
    }

    mostrarSiguiente();
    setInterval(mostrarSiguiente, CONFIG.INTERVALO_CARRUSEL);
}

async function inicializar(categoriasPermitidas = CONFIG.CATEGORIAS_DEFECTO) {
    try {
        const platos = await obtenerPlatos();
        const categorias = obtenerCategorias(platos, categoriasPermitidas);

        if (!categorias.length) {
            throw new Error("No se encontraron categorías para mostrar");
        }

        iniciarCarruselCategorias(categorias, platos);
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

function configurarEventosNavegacion() {
    const botonPasteleria = document.getElementById("btn-pasteleria");

    if (botonPasteleria) {
        botonPasteleria.addEventListener("click", redirigirAPasteleria);
    }
}

window.__carruselDesayunosInicializado = false;
window.inicializarCarrusel = function (categorias = null) {
    window.__carruselDesayunosInicializado = true;
    configurarEventosNavegacion();
    inicializar(categorias);
};

document.addEventListener("DOMContentLoaded", () => {
    if (!window.__carruselDesayunosInicializado) {
        configurarEventosNavegacion();
        inicializar();
    }
});
