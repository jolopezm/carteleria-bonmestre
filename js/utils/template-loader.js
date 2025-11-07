/**
 * Carga de templates HTML
 */
import { TEMPLATE_CONFIG } from "./config.js";

/**
 * Carga un template individual
 * @param {string} templateName - Nombre del template (sin extensión)
 * @returns {Promise<string>} Contenido HTML del template
 */
export async function cargarTemplate(templateName) {
    try {
        const response = await fetch(
            `${TEMPLATE_CONFIG.TEMPLATE_DIR}${templateName}.html`
        );
        if (!response.ok) {
            throw new Error(`Template ${templateName} no encontrado`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Error cargando template ${templateName}:`, error);
        throw error;
    }
}

/**
 * Carga múltiples templates en paralelo
 * @param {string[]} templateNames - Array de nombres de templates
 * @returns {Promise<Object>} Objeto con templates cargados {nombre: contenidoHTML}
 */
export async function cargarTemplates(templateNames) {
    const templates = {};
    const promesas = templateNames.map(async (name) => {
        templates[name] = await cargarTemplate(name);
    });
    await Promise.all(promesas);
    return templates;
}
