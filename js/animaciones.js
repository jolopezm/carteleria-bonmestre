// ============================================
// ANIMACIONES GLOBALES - CARTELERÍA BONMESTRE
// ============================================

/**
 * Inicializa las animaciones cuando jQuery está disponible
 */
$(document).ready(function () {
    // Asegurar que el container comience oculto para el fade in inicial
    $("#container-productos").hide();

    // Fade in suave del título al cargar la página
    $("#categoria").hide().fadeIn(1000);

    console.log("✓ Animaciones jQuery inicializadas");
});

$("producto").ready(function mostrarProductosCategoria() {
    setTimeout(function () {
        $("#container-productos").animate({ scrollTop: 0 }, 300);
    }, 300);
});
