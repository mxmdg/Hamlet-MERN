const template = require("../ApoXML/BusinessCard_intent_template")

const flatWorkApoXMLExporter = async (req, res, next) => {
    try {
        const tenant = req.header("x-tenant");
        const { orden, 
                nombre,
                tipoTrabajo,
                partes,
                cliente, 
                contactoClienteNombre , 
                contactoClienteApellido,
                contactoClienteEmail,
                cantidad,
                jobId,
             } = req.body;
        const xml = await template(
                            orden,
                            nombre,
                            tipoTrabajo,
                            partes,
                            cliente,
                            contactoClienteNombre,
                            contactoClienteApellido,
                            contactoClienteEmail,
                            cantidad,
                            jobId,
                            tenant,
                        );
        res.setHeader("Content-Type", "application/xml");
        res.send(xml);
        return xml;
    } catch (error) {
        console.error("Error al generar el XML:", error);
        res.status(500).send("Error al generar el XML");
    }
}

module.exports = flatWorkApoXMLExporter;