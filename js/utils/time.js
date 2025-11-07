/**
 * Funciones para manejo de fecha y hora
 */

/**
 * Obtiene la hora actual formateada
 * @returns {string} Hora en formato HH:MM (24 horas)
 */
export function obtenerHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

/**
 * Obtiene configuración actual (hora, temperatura)
 * @returns {Object} Configuración con hora y temperatura
 */
export function obtenerConfigActual() {
    return {
        hora: obtenerHoraActual(),
        temperatura: 31,
    };
}
