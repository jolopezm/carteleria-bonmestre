let count = 0;

export function obtenerHoraActual() {
    count++;
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

export function getCount() {
    return count;
}
