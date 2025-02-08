const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index");

router.get("/add-classification", utilities.checkJWTToken, utilities.checkAccountType, invController.addClassification);
router.post("/add-classification", utilities.checkJWTToken, utilities.checkAccountType, invController.addClassification);

router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/management", utilities.checkJWTToken, utilities.checkAccountType, invController.getManagementView);

router.get("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType, invController.showAddInventoryForm);
router.post("/add-inventory", utilities.checkJWTToken, utilities.checkAccountType, invController.addInventory);

router.get("/getInventory/:classification_id",  invController.getInventoryJSON);
router.get("/edit/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, invController.editInventoryView);
router.post("/update/",  utilities.checkJWTToken, utilities.checkAccountType, invController.updateInventory);

router.get("/delete/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, invController.deleteView);
router.post("/delete", utilities.checkJWTToken, utilities.checkAccountType, invController.deleteItem);



module.exports = router;