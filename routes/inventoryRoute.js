const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

router.get("/add-classification", invController.addClassification);
router.post("/add-classification", invController.addClassification);

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/management", invController.getManagementView);

router.get("/add-inventory", invController.showAddInventoryForm);
router.post("/add-inventory", invController.addInventory);

router.get("/getInventory/:classification_id", invController.getInventoryJSON);
router.get("/edit/:inv_id", invController.editInventoryView);
router.post("/update/", invController.updateInventory);

router.get("/delete/:inv_id", invController.deleteView);
router.post("/delete", invController.deleteItem);



module.exports = router;