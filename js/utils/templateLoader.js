import { CONFIG } from "../constants.js"

async function cargarTemplate(templateName) {
    try {
        const response = await fetch(
            `${CONFIG.TEMPLATE_DIR}${templateName}.html`
        )
        if (!response.ok) {
            throw new Error(`Template ${templateName} no encontrado`)
        }
        return await response.text()
    } catch (error) {
        throw error
    }
}

async function cargarTemplates(templateNames) {
    const templates = {}
    const promesas = templateNames.map(async (name) => {
        templates[name] = await cargarTemplate(name)
    })
    await Promise.all(promesas)
    return templates
}

export { cargarTemplate, cargarTemplates }
