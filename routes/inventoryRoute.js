const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

router.get("/add-classification", invController.addClassification);
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/management", invController.getManagementView);
router.post("/add-classification", invController.addClassification);
router.get("/add-inventory", invController.showAddInventoryForm);
router.post("/add-inventory", invController.addInventory);

module.exports = router;