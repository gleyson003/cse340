const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/regValidate");
const utilities = require("../utilities/index");

/* ****************************************
*  Deliver login view
* *************************************** */
router.get("/login", accountController.buildLogin);
router.post(
    "/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    accountController.accountLogin
);

router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerAccount);

router.get("/account/", accountController.showLogin)
router.get(
    "/",
    utilities.checkLogin
)

module.exports = router;
