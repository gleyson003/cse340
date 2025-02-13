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
    req.flash("notice", "This email is already registered. Please use a different email. ");
  }
  
  if (regResult) {
    req.flash("notice", `Congratulations, you\'re registered ${fname}. Please log in.`)
    res.redirect("/account/login")
  } else {
    res.render("account/register", {
      title: "Registration",
      nav,
      messages: {
        notice: req.flash("notice"),
        error: req.flash("error")
      },
    })
  }
}

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

    res.render("account/account", {
      title: "Account Management",
      nav,
      message, 
      errors,  
    });
  } catch (error) {
    throw new Error("Error to load the account page.");
  }
};

async function updateAccount(req, res) {
  try {
    const { id, fname, lname, email } = req.body;    
    const updateResult = await accountModel.updateAccount({ fname, lname, email, id });

    if (updateResult) {
      req.flash("notice", "Account updated successfully.");
    } else {
      req.flash("error", "Account update failed.");
    }

    res.redirect(`/account/update/${id}`)
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}

async function updatePassword(req, res) {
    try {
      const {id, password} = req.body;

      if (!id || !password) {
        req.flash("error", "Invalid data.");
        return res.redirect(`/account/update/${id}`);
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const updateResult = await accountModel.updatePassword(id, hashedPassword);

      if (updateResult) {
        req.flash("notice", "Password updated successfully.");
      } else {
        req.flash("error", "Failed to updated password.")
      }

      res.redirect(`/account/update/${id}`)

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}


async function editAccountForm(req, res) {
  try {
      const accountId = req.params.id;
      const nav = await utilities.getNav();
      const accountData = await accountModel.getAccountById(accountId);

      let messages = {
        notice: req.flash("notice"),
        error: req.flash("error")
      };

      if (!accountData) {
          req.flash("notice", "Account not found.");
          return res.redirect("/account/");
      }

      res.render("account/editAccount", {
        title: "Edit Account",
        nav,
        messages,
        errors: null,
        accountData, 
      });
  } catch (error) {
      console.error("Error fetching account data:", error);
      res.status(500).send("Internal Server Error");
  }
}

async function logout(req, res) {
  if (req.cookies.jwt) { 
    res.clearCookie("jwt");
    res.redirect("/");
  } else {
    res.redirect("/account/login");
  }
}

async function getAccountsList(req, res) {
  try {  
    const nav = await utilities.getNav();
    const accountsList = await accountModel.accountsList(); // Adicionando await

    let messages = {
      notice: req.flash("notice"),
      error: req.flash("error")
    };

    if (!accountsList || accountsList.length === 0) { // Verifica se há resultados
        req.flash("notice", "No accounts found.");
        return res.redirect("/account/");
    }

    res.render("account/list", {
      title: "Accounts List",
      nav,
      messages,
      errors: null,
      accountsList, 
    });
  } catch (error) {
    console.error("Error fetching account data:", error);
    res.status(500).send("Internal Server Error");
  }
}


module.exports = {
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  showLogin,
  updateAccount,
  editAccountForm,
  updatePassword,
  logout,
  getAccountsList
};
