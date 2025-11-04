try {
    async function obtenerPlatos() {
        const response = await fetch("./data/platos.json");
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON");
        }
        return await response.json();
    }

    function mostrarProductoDestacado(producto) {
        const container = document.getElementById("producto-destacado");
        container.innerHTML = `
                <div id="producto">
                    <img class="producto-img" src="${
                        producto.img || ""
                    }" alt="${producto.alt || producto.nombre || ""}" />
                </div>
            `;

        // Añadir listener para redirigir a desayunos.html al hacer click en la imagen destacada
        const imgEl = container.querySelector(".producto-img");
        if (imgEl) {
            imgEl.style.cursor = "pointer";
            imgEl.addEventListener("click", () => {
                window.location.href = "desayunos.html";
            });
        }
    }

    function mostrarListaProductos(productos) {
        const container = document.getElementById("lista-productos");
        container.innerHTML = productos
            .map(
                (p) => `
                    <div class="lista-producto-info">
                        <h3>${p.nombre || "Sin nombre"}</h3>
                        <p>${
                            p.precio.toLocaleString()
                                ? "$" + p.precio.toLocaleString()
                                : ""
                        }</p>
                    </div>
            `
            )
            .join("");
    }

    function iniciarCarruselPasteleria(platos) {
        const categoria = "pasteleria";
        const productosCategoria = platos[categoria];

        if (!productosCategoria || productosCategoria.length === 0) {
            console.error(
                "No se encontraron productos en la categoría 'pasteleria'"
            );
            return;
        }

        document.getElementById("categoria").textContent =
            categoria.charAt(0).toUpperCase() + categoria.slice(1);

        mostrarListaProductos(productosCategoria);

        let productoIndex = 0;

        function mostrarSiguienteProducto() {
            const productoActual = productosCategoria[productoIndex];
            mostrarProductoDestacado(productoActual);

            document
                .querySelectorAll(".lista-producto-info")
                .forEach((el, idx) => {
                    if (idx === productoIndex) {
                        el.classList.add("current");
                    } else {
                        el.classList.remove("current");
                    }
                });

            productoIndex = (productoIndex + 1) % productosCategoria.length;
        }

        mostrarSiguienteProducto();
        setInterval(mostrarSiguienteProducto, 5000);
    }

    (async () => {
        try {
            const platos = await obtenerPlatos();
            iniciarCarruselPasteleria(platos);
        } catch (error) {
            console.error("Error al iniciar:", error);
        }
    })();
} catch (error) {
    console.error("Error al verificar usuario:", error);
}
