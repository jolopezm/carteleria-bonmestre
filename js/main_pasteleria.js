const CONFIG = {
    CATEGORIA_DEFECTO: "pasteleria",
    INTERVALO_CARRUSEL: 5000,
    RUTA_DATOS: "./data/platos.json",
    PAGINA_DESTINO: "desayunos.html",
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

function mostrarProductoDestacado(producto) {
    const container = document.getElementById("producto-destacado");

    if (!container) {
        console.error("No se encontró el contenedor del producto destacado");
        return;
    }

    container.innerHTML = `
        <div id="producto">
            <img 
                class="producto-img" 
                src="${producto.img || ""}" 
                alt="${producto.alt || producto.nombre || ""}"
            />
        </div>
    `;

    agregarEventoImagenDestacada(container);
}

function agregarEventoImagenDestacada(container) {
    const imagen = container.querySelector(".producto-img");

    if (imagen) {
        imagen.style.cursor = "pointer";
        imagen.addEventListener("click", () => {
            redirigirADesayunos();
        });
    }
}

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

function redirigirADesayunos() {
    window.location.href = CONFIG.PAGINA_DESTINO;
}

function iniciarCarruselPasteleria(
    platos,
    categoria = CONFIG.CATEGORIA_DEFECTO
) {
    const productosCategoria = platos[categoria];

    if (!productosCategoria || productosCategoria.length === 0) {
        console.error(
            `No se encontraron productos en la categoría '${categoria}'`
        );
        return;
    }

    const tituloCategoria = document.getElementById("categoria");
    if (tituloCategoria) {
        tituloCategoria.textContent =
            categoria.charAt(0).toUpperCase() + categoria.slice(1);
    }

    mostrarListaProductos(productosCategoria);

    let productoIndex = 0;

    function mostrarSiguienteProducto() {
        const productoActual = productosCategoria[productoIndex];

        mostrarProductoDestacado(productoActual);

        actualizarIndicadorProductoActual(productoIndex);

        productoIndex = (productoIndex + 1) % productosCategoria.length;
    }

    mostrarSiguienteProducto();
    setInterval(mostrarSiguienteProducto, CONFIG.INTERVALO_CARRUSEL);
}

async function inicializar(categoria = CONFIG.CATEGORIA_DEFECTO) {
    try {
        const platos = await obtenerPlatos();

        if (!platos[categoria]) {
            throw new Error(
                `La categoría '${categoria}' no existe en los datos`
            );
        }

        iniciarCarruselPasteleria(platos, categoria);
    } catch (error) {
        console.error("Error al iniciar la aplicación:", error);
    }
}

window.__carruselPasteleriaInicializado = false;

window.inicializarCarruselCategoria = function (
    categoria = CONFIG.CATEGORIA_DEFECTO
) {
    window.__carruselPasteleriaInicializado = true;
    inicializar(categoria);
};

document.addEventListener("DOMContentLoaded", () => {
    if (!window.__carruselPasteleriaInicializado) {
        inicializar();
    }
});
