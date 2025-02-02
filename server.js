/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pool = require('./database/')
const env = require("dotenv").config()
const { Client } = require('pg'); // Adicione a importação do pg
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute  = require("./routes/inventoryRoute")
const vechiclesDetails  = require("./routes/vehicleDetailsRoute")
const utilities = require('./utilities/index');
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

// Vehicles details routes
app.use("/inv", vechiclesDetails)

// Account route
app.use("/account", accountRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav;
  try {
    nav = await utilities.getNav(); 
  } catch (error) {
    console.error('Error to load nav:', error.message);
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav: nav || '',
  });
});


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
