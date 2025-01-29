const utilities = require("../utilities/index");
const accountModel = require("../models/account-model")



async function buildLogin(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "My Account",
      nav
    });
  } catch (error) {
    throw new Error("Error to load the account page.");
  }
};

async function buildRegister(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav
    });
  } catch (error) {
    throw new Error("Error to load the register page.");
  }
};

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { fname, lname, email, password } = req.body

  const regResult = await accountModel.registerAccount(
    fname,
    lname,
    email,
    password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${fname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

module.exports = {buildLogin, buildRegister, registerAccount};
