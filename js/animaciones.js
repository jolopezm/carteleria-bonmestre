$(document).ready(function () {
    $("#container-productos").hide();

    $("#categoria").hide().fadeIn(1000);
});

$("producto").ready(function mostrarProductosCategoria() {
    setTimeout(function () {
        $("#container-productos").animate({ scrollTop: 0 }, 300);
    }, 300);
});
