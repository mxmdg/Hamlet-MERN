#!/usr/bin/env node
const mongoose = require("../dbConnection");
const Tenant = require("../models/tenants").esquema;
const { Types } = require("mongoose");

function parseArgs() {
  const raw = process.argv.slice(2);
  const args = {};
  raw.forEach((tok) => {
    if (tok.startsWith("--")) {
      const eq = tok.indexOf("=");
      if (eq === -1) args[tok.replace(/^--/, "")] = true;
      else {
        const k = tok.slice(2, eq);
        const v = tok.slice(eq + 1);
        args[k] = v;
      }
    }
  });
  return args;
}

const args = parseArgs();
const DRY = args.dryRun || args.dry === true;

async function waitConnected() {
  if (mongoose.connection.readyState === 1) return;
  await new Promise((res) => mongoose.connection.once("connected", res));
}

async function resolveTenantId() {
  if (args.tenantId) return new Types.ObjectId(args.tenantId);

  // try tenantKey from CLI or infer from DB name
  const dbName =
    mongoose.connection.name ||
    (mongoose.connection.db && mongoose.connection.db.databaseName) ||
    "";
  const candidateKey = (args.tenantKey || dbName || "")
    .toString()
    .toLowerCase();

  if (!candidateKey) {
    throw new Error(
      "No tenantKey could be inferred. Provide --tenantKey=<key> or --tenantId=<id>"
    );
  }

  let tenant = await Tenant.findOne({ key: candidateKey });
  if (!tenant) {
    // try fuzzy match
    tenant = await Tenant.findOne({ key: new RegExp(candidateKey, "i") });
  }
  if (!tenant) {
    throw new Error(
      `Tenant not found for key '${candidateKey}'. Use --tenantKey or --tenantId.`
    );
  }
  return tenant._id;
}

async function run() {
  try {
    await waitConnected();
    console.log(
      "Connected to DB:",
      mongoose.connection.name || mongoose.connection.db.databaseName
    );

    const tenantId = await resolveTenantId();
    console.log("Using tenant _id:", tenantId.toString());

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    for (const c of collections) {
      const name = c.name;
      if (name.startsWith("system.")) continue;
      if (name === "tenants") continue;

      const col = mongoose.connection.db.collection(name);
      const filter = { tenant: { $exists: false } };
      const missing = await col.countDocuments(filter);
      if (missing === 0) {
        console.log(`- ${name}: no documents to update`);
        continue;
      }

      if (DRY) {
        console.log(
          `- ${name}: ${missing} documents would be updated (dry-run)`
        );
      } else {
        const tenantObj =
          tenantId && tenantId._bsontype === "ObjectID"
            ? tenantId
            : new Types.ObjectId(tenantId);
        const res = await col.updateMany(filter, {
          $set: { tenant: tenantObj },
        });
        console.log(
          `- ${name}: matched ${res.matchedCount}, modified ${res.modifiedCount}`
        );
      }
    }

    console.log("Done.");
  } catch (err) {
    console.error("Error:", err.message || err);
    process.exitCode = 2;
  } finally {
    try {
      await mongoose.connection.close();
    } catch (e) {}
  }
}

if (require.main === module) {
  console.log("Migration script: add tenant to documents");
  console.log("Usage examples:");
  console.log("  node backend/migrations/addTenantToDocuments.js --dryRun");
  console.log(
    "  node backend/migrations/addTenantToDocuments.js --tenantKey=imprentadorrego --dryRun"
  );
  console.log(
    "  node backend/migrations/addTenantToDocuments.js --tenantId=60a... "
  );
  run();
}

module.exports = { run };
