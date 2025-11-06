// ============================================
// CARTELERÍA BONMESTRE - DESAYUNOS/ALMUERZOS
// ============================================

// --------------------------------------------
// 1. CONFIGURACIÓN Y CONSTANTES
// --------------------------------------------
const CONFIG = {
    PRODUCTOS_POR_PAGINA: 2,
    INTERVALO_CARRUSEL: 5000, // 5 segundos
    DURACION_FADE_OUT: 500, // 0.5 segundos
    DURACION_FADE_IN: 800, // 0.8 segundos
    RUTA_DATOS: "./data/platos.json",
    PAGINA_DESTINO: "pasteleria.html",
    // Categorías por defecto (null = mostrar todas)
    CATEGORIAS_DEFECTO: null,
};

// --------------------------------------------
// 2. FUNCIONES DE DATOS (API)
// --------------------------------------------

/**
 * Obtiene los platos desde el archivo JSON
 * @returns {Promise<Object>} Objeto con categorías y sus platos
 */
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

/**
 * Extrae las categorías disponibles de los platos
 * @param {Object} platos - Objeto con todas las categorías
 * @param {Array<string>|null} categoriasFiltro - Array de categorías específicas a incluir (null = todas)
 * @returns {Array<string>} Lista de nombres de categorías filtradas
 */
function obtenerCategorias(platos, categoriasFiltro = null) {
    const todasLasCategorias = Object.keys(platos);

    // Si no hay filtro, devolver todas las categorías
    if (!categoriasFiltro || categoriasFiltro.length === 0) {
        return todasLasCategorias;
    }

    // Filtrar solo las categorías solicitadas que existen en los datos
    return categoriasFiltro.filter((categoria) =>
        todasLasCategorias.includes(categoria)
    );
}

// --------------------------------------------
// 3. FUNCIONES DE RENDERIZADO
// --------------------------------------------

/**
 * Renderiza los productos de una categoría específica con animación fade
 * @param {string} categoria - Nombre de la categoría
 * @param {Object} platos - Objeto con todas las categorías
 * @param {number} productoIndex - Índice del primer producto a mostrar
 * @param {number} productosPorPagina - Cantidad de productos a mostrar
 */
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

    // Fade out del contenido actual
    $container.fadeOut(CONFIG.DURACION_FADE_OUT, function () {
        // Actualizar título
        $titulo.text(categoria);

        // Preparar productos
        const productosCategoria = platos[categoria] || [];
        const productosAMostrar = productosCategoria.slice(
            productoIndex,
            productoIndex + productosPorPagina
        );

        // Renderizar HTML
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

        // Agregar eventos a las imágenes
        agregarEventosImagenes();

        // Fade in del nuevo contenido
        $container.fadeIn(CONFIG.DURACION_FADE_IN);
    });
}

/**
 * Añade event listeners a las imágenes de productos
 */
function agregarEventosImagenes() {
    $(".producto-img").each(function () {
        $(this)
            .css("cursor", "pointer")
            .on("click", function () {
                redirigirAPasteleria();
            });
    });
}

// --------------------------------------------
// 4. FUNCIONES DE NAVEGACIÓN
// --------------------------------------------

/**
 * Redirige a la página de pastelería
 */
function redirigirAPasteleria() {
    window.location.href = CONFIG.PAGINA_DESTINO;
}

// --------------------------------------------
// 5. LÓGICA DEL CARRUSEL
// --------------------------------------------

/**
 * Inicializa y ejecuta el carrusel de categorías con animaciones
 * @param {Array<string>} categorias - Lista de categorías
 * @param {Object} platos - Objeto con todas las categorías y platos
 * @param {number} productosPorPagina - Cantidad de productos por vista
 */
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

    // Mostrar inmediatamente el primer conjunto
    mostrarSiguiente();

    // Configurar intervalo para cambios automáticos
    setInterval(mostrarSiguiente, CONFIG.INTERVALO_CARRUSEL);
}

// --------------------------------------------
// 6. INICIALIZACIÓN
// --------------------------------------------

/**
 * Inicializa la aplicación cuando el DOM está listo
 * @param {Array<string>|null} categoriasPermitidas - Array de categorías a mostrar (null = todas)
 */
async function inicializar(categoriasPermitidas = CONFIG.CATEGORIAS_DEFECTO) {
    try {
        const platos = await obtenerPlatos();
        const categorias = obtenerCategorias(platos, categoriasPermitidas);

        if (!categorias.length) {
            throw new Error("No se encontraron categorías para mostrar");
        }

        console.log("Categorías a mostrar:", categorias);
        iniciarCarruselCategorias(categorias, platos);
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

/**
 * Configura los event listeners de navegación
 */
function configurarEventosNavegacion() {
    const botonPasteleria = document.getElementById("btn-pasteleria");

    if (botonPasteleria) {
        botonPasteleria.addEventListener("click", redirigirAPasteleria);
    }
}

// --------------------------------------------
// 7. API PÚBLICA
// --------------------------------------------

// Flag para controlar la auto-inicialización
window.__carruselDesayunosInicializado = false;

/**
 * Función pública para inicializar el carrusel con categorías específicas
 * Puedes llamar esta función desde el HTML con las categorías que quieras mostrar
 *
 * @param {Array<string>} categorias - Array con los nombres de las categorías a mostrar
 *
 * @example
 * // En tu HTML:
 * // <script>
 * //   inicializarCarrusel(['desayunos', 'cafeteria', 'brunches']);
 * // </script>
 */
window.inicializarCarrusel = function (categorias = null) {
    window.__carruselDesayunosInicializado = true;
    configurarEventosNavegacion();
    inicializar(categorias);
};

// Ejecutar cuando el DOM esté completamente cargado
// Solo auto-inicializa si no se ha llamado manualmente a inicializarCarrusel
document.addEventListener("DOMContentLoaded", () => {
    if (!window.__carruselDesayunosInicializado) {
        configurarEventosNavegacion();
        inicializar();
    }
});
