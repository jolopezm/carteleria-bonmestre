// ============================================
// CARTELERÍA BONMESTRE - PASTELERÍA
// ============================================

// --------------------------------------------
// 1. CONFIGURACIÓN Y CONSTANTES
// --------------------------------------------
const CONFIG = {
    CATEGORIA_DEFECTO: "pasteleria",
    INTERVALO_CARRUSEL: 5000, // 5 segundos
    RUTA_DATOS: "./data/platos.json",
    PAGINA_DESTINO: "desayunos.html",
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

// --------------------------------------------
// 3. FUNCIONES DE RENDERIZADO
// --------------------------------------------

/**
 * Renderiza el producto destacado en el carrusel
 * @param {Object} producto - Producto a destacar
 */
function mostrarProductoDestacado(producto) {
    const container = document.getElementById("producto-destacado");

    if (!container) {
        console.error("No se encontró el contenedor del producto destacado");
        return;
    }

    // Renderizar producto
    container.innerHTML = `
        <div id="producto">
            <img 
                class="producto-img" 
                src="${producto.img || ""}" 
                alt="${producto.alt || producto.nombre || ""}"
            />
        </div>
    `;

    // Añadir interactividad a la imagen
    agregarEventoImagenDestacada(container);
}

/**
 * Añade event listener a la imagen destacada
 * @param {HTMLElement} container - Contenedor del producto destacado
 */
function agregarEventoImagenDestacada(container) {
    const imagen = container.querySelector(".producto-img");

    if (imagen) {
        imagen.style.cursor = "pointer";
        imagen.addEventListener("click", () => {
            redirigirADesayunos();
        });
    }
}

/**
 * Renderiza la lista completa de productos de pastelería
 * @param {Array<Object>} productos - Lista de productos
 */
function mostrarListaProductos(productos) {
    const container = document.getElementById("lista-productos");

    if (!container) {
        console.error("No se encontró el contenedor de la lista de productos");
        return;
    }

    container.innerHTML = productos
        .map(
            (producto) => `
                <div class="lista-producto-info">
                    <h3>${producto.nombre || "Sin nombre"}</h3>
                    <p>${
                        producto.precio
                            ? "$" + producto.precio.toLocaleString()
                            : ""
                    }</p>
                </div>
            `
        )
        .join("");
}

/**
 * Actualiza el indicador visual del producto actual en la lista
 * @param {number} indiceActual - Índice del producto destacado actual
 */
function actualizarIndicadorProductoActual(indiceActual) {
    const itemsLista = document.querySelectorAll(".lista-producto-info");

    itemsLista.forEach((elemento, indice) => {
        if (indice === indiceActual) {
            elemento.classList.add("current");
        } else {
            elemento.classList.remove("current");
        }
    });
}

// --------------------------------------------
// 4. FUNCIONES DE NAVEGACIÓN
// --------------------------------------------

/**
 * Redirige a la página de desayunos
 */
function redirigirADesayunos() {
    window.location.href = CONFIG.PAGINA_DESTINO;
}

// --------------------------------------------
// 5. LÓGICA DEL CARRUSEL
// --------------------------------------------

/**
 * Inicializa y ejecuta el carrusel de pastelería
 * @param {Object} platos - Objeto con todas las categorías y platos
 * @param {string} categoria - Nombre de la categoría a mostrar
 */
function iniciarCarruselPasteleria(
    platos,
    categoria = CONFIG.CATEGORIA_DEFECTO
) {
    const productosCategoria = platos[categoria];

    // Validar que existan productos
    if (!productosCategoria || productosCategoria.length === 0) {
        console.error(
            `No se encontraron productos en la categoría '${categoria}'`
        );
        return;
    }

    // Actualizar título de categoría
    const tituloCategoria = document.getElementById("categoria");
    if (tituloCategoria) {
        tituloCategoria.textContent =
            categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }

    // Mostrar lista completa de productos
    mostrarListaProductos(productosCategoria);

    // Inicializar índice del carrusel
    let productoIndex = 0;

    /**
     * Muestra el siguiente producto en el carrusel
     */
    function mostrarSiguienteProducto() {
        const productoActual = productosCategoria[productoIndex];

        // Actualizar producto destacado
        mostrarProductoDestacado(productoActual);

        // Actualizar indicador visual en la lista
        actualizarIndicadorProductoActual(productoIndex);

        // Avanzar al siguiente producto (circular)
        productoIndex = (productoIndex + 1) % productosCategoria.length;
    }

    // Mostrar primer producto inmediatamente
    mostrarSiguienteProducto();

    // Configurar intervalo para rotación automática
    setInterval(mostrarSiguienteProducto, CONFIG.INTERVALO_CARRUSEL);
}

// --------------------------------------------
// 6. INICIALIZACIÓN
// --------------------------------------------

/**
 * Inicializa la aplicación cuando el DOM está listo
 * @param {string} categoria - Categoría a mostrar (por defecto: pasteleria)
 */
async function inicializar(categoria = CONFIG.CATEGORIA_DEFECTO) {
    try {
        // Obtener datos
        const platos = await obtenerPlatos();

        // Validar que la categoría existe
        if (!platos[categoria]) {
            throw new Error(
                `La categoría '${categoria}' no existe en los datos`
            );
        }

        console.log("Mostrando categoría:", categoria);

        // Iniciar carrusel
        iniciarCarruselPasteleria(platos, categoria);
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

// --------------------------------------------
// 7. API PÚBLICA
// --------------------------------------------

// Flag para controlar la auto-inicialización
window.__carruselPasteleriaInicializado = false;

/**
 * Función pública para inicializar el carrusel con una categoría específica
 * Puedes llamar esta función desde el HTML con la categoría que quieras mostrar
 *
 * @param {string} categoria - Nombre de la categoría a mostrar
 *
 * @example
 * // En tu HTML:
 * // <script>
 * //   inicializarCarruselCategoria('postres');
 * // </script>
 */
window.inicializarCarruselCategoria = function (
    categoria = CONFIG.CATEGORIA_DEFECTO
) {
    window.__carruselPasteleriaInicializado = true;
    inicializar(categoria);
};

// Ejecutar cuando el DOM esté completamente cargado
// Solo auto-inicializa si no se ha llamado manualmente a inicializarCarruselCategoria
document.addEventListener("DOMContentLoaded", () => {
    if (!window.__carruselPasteleriaInicializado) {
        inicializar();
    }
});
