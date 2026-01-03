const express = require("express");
const router = express.Router();
const onboardingController = require("./controllers/onboardingControl");

// Registro inicial (público)
router.post("/", onboardingController.register);

module.exports = router;
