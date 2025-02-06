const utilities = require("../utilities/index");
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


async function buildLogin(req, res) {
  try {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "My Account",
      nav
    });
  } catch (error) {
    throw new Error("Error to load the account login page.");
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
  const emailExists = await accountModel.checkExistingEmail(email)
  
  let regResult = []

  if (emailExists == 0) {
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    regResult = await accountModel.registerAccount(fname, lname, email, hashedPassword)
  } else {
    regResult = false
    req.flash("notice", "Register email. Use another email.");
  }
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${fname}. Please log in.`
    )
    res.redirect("/account/login")
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { email, password } = req.body
  const accountData = await accountModel.getAccountByEmail(email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      email,
    })
    return
  }
  try {
    if (await bcrypt.compare(password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function showLogin(req, res) {
  try {

    const nav = await utilities.getNav(); 
    const message = req.flash('success_message');
    const errors = req.flash('errors'); 

    res.render("account", {
      title: "Account Management",
      nav,
      message, 
      errors,  
    });
  } catch (error) {
    throw new Error("Error to load the account page.");
  }
};

module.exports = {
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  showLogin 
};
