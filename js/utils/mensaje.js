import { cargarTemplate } from "./templateLoader.js"

async function mostrarMensaje(mensaje) {
    try {
        const templateHTML = await cargarTemplate("mensaje")
        const mensajeBox = document.createElement("div")
        mensajeBox.innerHTML = templateHTML.replace("{{ mensaje }}", mensaje)
        document.body.appendChild(mensajeBox)
    } catch (error) {
        console.error("Error al mostrar el mensaje:", error)
    }
}

export { mostrarMensaje }
