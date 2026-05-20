const template = require("../ApoXML/BusinessCard_intent_template");

const flatWorkApoXMLExporter = async (req, res, next) => {
    try {
        // Recibimos la estructura unificada directamente desde el frontend
        const data = req.body; 
        
        // Validación básica de seguridad
        if (!data.partes || data.partes.length === 0) {
            return res.status(400).send("Error: No se enviaron partes válidas para procesar el trabajo.");
        }

        // Ejecutamos la plantilla pasándole el objeto completo con el array de partes
        const xml = template(data);
        
        res.setHeader("Content-Type", "application/xml");
        res.send(xml);
        return xml;
        
    } catch (error) {
        console.error("Error crítico al generar el XML nativo ApoXML:", error);
        res.status(500).send("Error interno al procesar el archivo ApoXML");
    }
}

module.exports = flatWorkApoXMLExporter;