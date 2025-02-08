const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};

Util.buildVehicleDetails = async function(data){
  let grid
  if(data.length > 0){
    grid = '<div id="details">'
      grid += `<img src="${data[0].inv_image}" alt="${data[0].inv_make} image"/>`
      grid += `<h3>${data[0].inv_make} ${data[0].inv_model} Details</h3>`
      grid += `<p class="price backColor">Price: $${new Intl.NumberFormat('en-US').format(data[0].inv_price)}</p>`
      grid += `<p><span>Description:</span> ${data[0].inv_description}</p>`
      grid += `<p class="backColor"><span>Color: </span>${data[0].inv_color}</p>`
      grid += `<p><span>Miles: </span>${new Intl.NumberFormat('en-US').format(data[0].inv_miles)}</p>`
    grid += '</div>'  
  }
  return grid
};

Util.buildClassificationList = async function () {
  let list = "";
  try {
    let data = await invModel.getClassifications();
    data.rows.forEach((row) => {
      list += `<option value="${row.classification_id}">${row.classification_name}</option>`;
    });
  } catch (error) {
    console.error("Error building classification list:", error);
  }
  return list;
};


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData) {
      if (err) {
        req.flash("Please log in");
        res.clearCookie("jwt");
        return res.redirect("/account/login");
      }

      res.locals.accountData = accountData;
      res.locals.loggedin = 1;

      next();
    });
  } else {
    next();
  }
};

Util.checkAccountType = (req, res, next) => {
  const accountData = res.locals.accountData;

  if (accountData && (accountData.account_type === 'Employee' || accountData.account_type === 'Admin')) {
    return next();
  } else {
    req.flash("notice", "You can't access this page.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util;