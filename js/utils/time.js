let count = 0

function obtenerHoraActual() {
    count++
    const ahora = new Date()
    return ahora.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

function obtenerConfigActual() {
    return {
        hora: obtenerHoraActual(),
        temperatura: 31,
    }
}

function getCount() {
    return count
}

export { obtenerHoraActual, obtenerConfigActual, getCount }
