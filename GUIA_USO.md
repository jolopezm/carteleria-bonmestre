# 📋 Guía de Uso - Cartelería Bonmestre

## 🎯 Funciones Disponibles

### Para Carrusel de Múltiples Categorías (`main_desayunos.js`)

#### `inicializarCarrusel(categorias)`

Inicializa el carrusel mostrando solo las categorías especificadas.

**Parámetros:**

-   `categorias` (Array<string> | null): Array con los nombres de las categorías a mostrar. Si es `null` o no se pasa, muestra todas las categorías.

**Ejemplo de uso:**

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="js/main_desayunos.js" defer></script>
    </head>
    <body>
        <h1 id="categoria">Categoria</h1>
        <section id="container-productos"></section>

        <script>
            document.addEventListener("DOMContentLoaded", () => {
                // Mostrar solo desayunos, cafetería y brunches
                inicializarCarrusel(["desayunos", "cafeteria", "brunches"]);
            });
        </script>
    </body>
</html>
```

---

### Para Carrusel de Categoría Única (`main_pasteleria.js`)

#### `inicializarCarruselCategoria(categoria)`

Inicializa el carrusel mostrando una categoría específica con producto destacado.

**Parámetros:**

-   `categoria` (string): Nombre de la categoría a mostrar. Por defecto: `'pasteleria'`

**Ejemplo de uso:**

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="js/main_pasteleria.js" defer></script>
    </head>
    <body>
        <h1 id="categoria">Categoria</h1>
        <section id="container">
            <div id="producto-destacado"></div>
            <div id="lista-productos"></div>
        </section>

        <script>
            document.addEventListener("DOMContentLoaded", () => {
                // Mostrar solo postres
                inicializarCarruselCategoria("postres");
            });
        </script>
    </body>
</html>
```

---

## 📂 Categorías Disponibles

Según tu archivo `data/platos.json`, las categorías disponibles son:

-   `desayunos`
-   `cafeteria`
-   `brunches`
-   `pasteleria`
-   `postres`
-   `sandwiches`
-   `hamburguesas`
-   `platosdefondo`
-   `ensaladas`
-   `platodeldia`
-   `platossugeridos`
-   `trattoria`
-   `bebidas-frias`
-   `bebestibles`

---

## 🎨 Casos de Uso Comunes

### 1. Mostrar todas las categorías (comportamiento por defecto)

**Opción A - Dejar el HTML sin script:**

```html
<script src="js/main_desayunos.js" defer></script>
<!-- No agregar nada más, mostrará todas automáticamente -->
```

**Opción B - Llamar explícitamente:**

```html
<script>
    document.addEventListener("DOMContentLoaded", () => {
        inicializarCarrusel(null); // o inicializarCarrusel()
    });
</script>
```

---

### 2. Pantalla solo de desayunos y cafetería

```html
<script src="js/main_desayunos.js" defer></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        inicializarCarrusel(["desayunos", "cafeteria"]);
    });
</script>
```

---

### 3. Pantalla de comidas principales

```html
<script src="js/main_desayunos.js" defer></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        inicializarCarrusel([
            "platosdefondo",
            "platodeldia",
            "platossugeridos",
            "hamburguesas",
            "sandwiches",
        ]);
    });
</script>
```

---

### 4. Pantalla de bebidas

```html
<script src="js/main_desayunos.js" defer></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        inicializarCarrusel(["bebidas-frias", "bebestibles"]);
    });
</script>
```

---

### 5. Pantalla de dulces (usando main_pasteleria.js)

```html
<script src="js/main_pasteleria.js" defer></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        inicializarCarruselCategoria("postres");
    });
</script>
```

---

## 🔧 Configuración Avanzada

### Modificar configuración por archivo HTML

Puedes cambiar la configuración antes de inicializar:

```html
<script src="js/main_desayunos.js" defer></script>
<script>
    document.addEventListener("DOMContentLoaded", () => {
        // Modificar configuración
        CONFIG.PRODUCTOS_POR_PAGINA = 3; // Mostrar 3 productos a la vez
        CONFIG.INTERVALO_CARRUSEL = 8000; // Cambiar cada 8 segundos

        // Inicializar con categorías específicas
        inicializarCarrusel(["brunches", "desayunos"]);
    });
</script>
```

---

## 📝 Estructura de Archivos HTML Recomendada

### Para carrusel multi-categoría:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mi Cartelería</title>
        <link rel="stylesheet" href="css/styles_desayunos.css" />
        <script src="js/main_desayunos.js" defer></script>
    </head>
    <body>
        <h1 id="categoria">Categoria</h1>
        <section id="container-productos"></section>

        <script>
            document.addEventListener("DOMContentLoaded", () => {
                inicializarCarrusel(["categoria1", "categoria2"]);
            });
        </script>
    </body>
</html>
```

### Para carrusel de categoría única:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mi Categoría</title>
        <link rel="stylesheet" href="css/styles_pasteleria.css" />
        <script src="js/main_pasteleria.js" defer></script>
    </head>
    <body>
        <h1 id="categoria">Categoria</h1>
        <section id="container">
            <div id="producto-destacado"></div>
            <div id="lista-productos"></div>
        </section>

        <script>
            document.addEventListener("DOMContentLoaded", () => {
                inicializarCarruselCategoria("nombreCategoria");
            });
        </script>
    </body>
</html>
```

---

## ⚠️ Notas Importantes

1. **Orden de scripts**: Asegúrate de que el script principal (`main_desayunos.js` o `main_pasteleria.js`) tenga el atributo `defer` y esté antes del script inline.

2. **Categorías inválidas**: Si especificas una categoría que no existe, aparecerá un error en la consola y no se mostrará nada.

3. **Array vacío**: Si pasas un array vacío `[]`, se mostrarán todas las categorías disponibles.

4. **Compatibilidad**: Ambos archivos mantienen retrocompatibilidad. Si no llamas a las funciones públicas, funcionarán con su comportamiento por defecto.

---

## 🚀 Ejemplos Incluidos

-   `ejemplo-categorias-especificas.html` - Muestra cómo filtrar múltiples categorías
-   `ejemplo-postres.html` - Muestra cómo mostrar una sola categoría con producto destacado

---

## 📞 Soporte

Para más información o problemas, revisa la consola del navegador (F12) donde se muestran logs útiles como:

-   "Categorías a mostrar: [...]"
-   "Mostrando categoría: ..."
-   Errores si algo falla
