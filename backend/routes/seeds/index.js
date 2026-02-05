const printersSeed = require("./printers.seed");
const printersSchema = require("../../models/printers").esquema;
const pricesSeed = require("./prices.seed");
const pricesSchema = require("../../models/prices").esquema;

async function runSeeds({ tenantId }) {
  console.log("🌱 Seeding prices...");
  console.log(pricesSeed);

  for (const priceData of pricesSeed) {
    try {
      const price = { ...priceData, tenant: tenantId };
      await pricesSchema.create(price);
    } catch (error) {
      console.error(
        `❌ Error seeding price ${priceData.Categoria}:`,
        error.message,
      );
    }
  }

  const formatsSeed = require("./formats.seed");
  const formatosSchema = require("../../models/formatos").esquema;

  console.log("Seeding formatos");
  console.log(formatsSeed);

  for (const formatoData of formatsSeed) {
    try {
      const formato = {
        ...formatoData,
        tenant: tenantId,
      };
      await formatosSchema.create(formato);
      console.log(`✔ Formato ${formato.Nombre} seeded`);
    } catch (error) {
      console.error(
        `❌ Error seeding formato ${formatoData.Nombre}:`,
        error.message,
      );
    }
  }

  console.log("Seed customer");

  const customersSeed = require("./empresas.seed");
  const customersSchema = require("../../models/empresas").esquema;
  for (const customerData of customersSeed) {
    try {
      const customer = {
        ...customerData,
        tenant: tenantId,
      };
      await customersSchema.create(customer);
      console.log(`✔ Customer ${customer.Nombre} seeded`);
    } catch (error) {
      console.error(
        `❌ Error seeding customer ${customerData.Nombre}:`,
        error.message,
      );
    }
  }

  console.log("🌱 Seeding printers...");

  // resolver dependencias UNA vez
  const printPrice = await pricesSchema.findOne({
    tenant: tenantId,
    Categoria: "print",
  });

  if (!printPrice) {
    throw new Error("No se encontró price 'print' para seed de printers");
  }

  console.log(printersSeed);

  for (const printerData of printersSeed) {
    try {
      const printer = {
        ...printerData,
        tenant: tenantId,
        Costo: printPrice._id,
      };

      await printersSchema.create(printer);
      console.log(`✔ Printer ${printer.Nombre} seeded`);
    } catch (error) {
      console.error(
        `❌ Error seeding printer ${printerData.Nombre}:`,
        error.message,
      );
    }
  }

  console.log("Seeding JobParts");

  const jobPartsSeed = require("./jobparts.seed");
  const jobPartsSchema = require("../../models/jobParts").esquema;

  console.log(jobPartsSeed);

  for (const jobPartData of jobPartsSeed) {
    try {
      const jobPart = {
        ...jobPartData,
        tenant: tenantId,
      };
      await jobPartsSchema.create(jobPart);
      console.log(`✔ JobPart ${jobPart.Nombre} seeded`);
    } catch (error) {
      console.error(
        `❌ Error seeding job part ${jobPartData.Nombre}:`,
        error.message,
      );
    }
  }

  console.log("Seeding Materials");

  // Dependencias
  const stockPrice = await pricesSchema.findOne({
    tenant: tenantId,
    Categoria: "stock",
  });
  if (!stockPrice) {
    throw new Error("No se encontró price 'stock' para seed de materials");
  }

  const Materiales = require("../../models/materiales").esquema;
  const materialsSeed = require("./materials.seed");
  for (const materialData of materialsSeed) {
    try {
      const material = {
        ...materialData,
        tenant: tenantId,
        Precio_x_Kilo: stockPrice._id,
      };
      await Materiales.create(material);
      console.log(`✔ Material ${material.Nombre} seeded`);
    } catch (error) {
      console.error(
        `❌ Error seeding material ${materialData.Nombre}:`,
        error.message,
      );
    }
  }

  console.log("Seeding Finishers");

  // Dependencias
  const finishingPrice = await pricesSchema.findOne({
    tenant: tenantId,
    Categoria: "finishing",
  });
  if (!finishingPrice) {
    throw new Error("No se encontró price 'finishing' para seed de finishers");
  }
  const jobTypesAllowed = {
    jobTypesAllowed: [
      "Libro",
      "Revista",
      "Anillado",
      "Sin Encuadernacion",
      "Multipagina",
      "Cosido a Hilo",
    ],
  };

  const jobParts = await jobPartsSchema.find({ tenant: tenantId });
  const jobPartsNames = [];
  jobParts.forEach((part) => jobPartsNames.push(part.Type));
  const partTypesAllowed = { partTypesAllowed: jobPartsNames };

  const Finishers = require("../../models/finishers").esquema;
  const finishersSeed = require("./finishers.seed");
  for (const finisherData of finishersSeed) {
    try {
      const finisher = {
        ...finisherData,
        jobTypesAllowed: jobTypesAllowed.jobTypesAllowed,
        partTypesAllowed: partTypesAllowed.partTypesAllowed,
        tenant: tenantId,
        Costo: finishingPrice._id,
      };
      await Finishers.create(finisher);
      console.log(`✔ Finisher ${finisher.Nombre} seeded`);
    } catch (error) {
      console.error(
        `❌ Error seeding finisher ${finisherData.Nombre}:`,
        error.message,
      );
    }
  }

  console.log("✅ Seeds completed successfully");
}

module.exports = { runSeeds };
