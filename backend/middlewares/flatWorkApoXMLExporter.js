const template = require("../ApoXML/BusinessCard_intent_template")

const flatWorkApoXMLExporter = async (req, res, next) => {
    try {
        const { orden, 
                nombre,
                nombreParte,
                tipoParte,  
                ancho, 
                alto, 
                paginas, 
                cliente, 
                contactoClienteNombre , 
                contactoClienteApellido,
                contactoClienteEmail,
                cantidad,
                gramaje,
                materialTipo,
                anchoResma,
                altoResma,
                jobId,
             } = req.body;
        const xml = template(orden, 
                            nombre, 
                            nombreParte,
                            tipoParte, 
                            ancho, 
                            alto, 
                            paginas, 
                            cliente, 
                            contactoClienteNombre , 
                            contactoClienteApellido,
                            contactoClienteEmail,
                            cantidad,
                            gramaje,
                            materialTipo,
                            anchoResma,
                            altoResma,
                            jobId,);
        res.setHeader("Content-Type", "application/xml");
        res.send(xml);
        return xml;
    } catch (error) {
        console.error("Error al generar el XML:", error);
        res.status(500).send("Error al generar el XML");
    }
}

module.exports = flatWorkApoXMLExporter;