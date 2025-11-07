export function obtenerHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function obtenerConfigActual() {
    return {
        hora: obtenerHoraActual(),
        temperatura: 31,
    };
}
