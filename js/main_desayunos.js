try {
    async function obtenerPlatos() {
        const response = await fetch("./data/platos.json");
        if (!response.ok) {
            throw new Error("Error al cargar el archivo JSON");
        }
        return await response.json();
    }

    function obtenerCategorias(platos) {
        return Object.keys(platos);
    }

    function mostrarProductosDeCategoria(
        categoria,
        platos,
        productoIndex,
        productosPorPagina
    ) {
        const container = document.getElementById("container-productos");
        const titulo = document.getElementById("categoria");
        titulo.textContent = categoria;

        const productosCategoria = platos[categoria];
        const productosAMostrar = productosCategoria.slice(
            productoIndex,
            productoIndex + productosPorPagina
        );

        container.innerHTML = productosAMostrar
            .map(
                (p) => `
            <div id="producto">
                <img class="producto-img" src="${p.img || ""}" alt="${
                    p.alt || p.nombre || ""
                }" data-nombre="${p.nombre || ""}" />
                <h2>${p.nombre || "Sin nombre"}</h2>
                <p id="descripcion">${p.descripcion || ""}</p>
                <p id="precio">${p.precio ? "$" + p.precio : ""}</p>
            </div>
        `
            )
            .join("");

        // Añadir listener a las imágenes para redirigir a pasteleria.html al hacer click
        const imgs = container.querySelectorAll(".producto-img");
        imgs.forEach((img) => {
            img.style.cursor = "pointer";
            img.addEventListener("click", () => {
                window.location.href = "pasteleria.html";
            });
        });
    }

    function iniciarCarruselCategorias(
        categorias,
        platos,
        productosPorPagina = 2
    ) {
        let categoriaIndex = 0;
        let productoIndex = 0;

        function mostrarSiguiente() {
            const categoriaActual = categorias[categoriaIndex];
            const productosCategoria = platos[categoriaActual];

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
        setInterval(mostrarSiguiente, 5000);
    }

    (async () => {
        try {
            const platos = await obtenerPlatos();
            console.log(platos);
            const categorias = obtenerCategorias(platos);
            iniciarCarruselCategorias(categorias, platos, 2);
        } catch (error) {
            console.error("Error al iniciar el carrusel:", error);
        }
    })();

    function irAPasteleria() {
        window.location.href = "pasteleria.html";
    }
} catch (error) {
    console.error("Error al verificar usuario:", error);
}
