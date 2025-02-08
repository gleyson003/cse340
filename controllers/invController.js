const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0]?.classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildVehicleDetails = async function (req, res, next) {
  const vehicleId = req.params.vehicleId;
  const data = await invModel.getVehicleDetails(vehicleId);
  const grid = await utilities.buildVehicleDetails(data);
  let nav = await utilities.getNav();

  const vehicleYear = data[0].inv_year;
  const vehicleMake = data[0].inv_make;  
  const vehicleModel = data[0].inv_model;
  res.render("./inventory/vehicleDetails", {
    title: `${vehicleYear} ${vehicleMake} ${vehicleModel}`,
    nav,
    grid,
  })
}

invCont.getManagementView = async (req, res) => {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const messages = req.flash('info');
  res.render('inventory/management', { 
    title: "Vehicle Management",
    messages,
    nav,
    classificationList
  });
};

invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { className } = req.body;

  if (!className || /\W/.test(className)) {
    req.flash("error", "Invalid classification name. No spaces or special characters allowed.");
    return res.render("inventory/addClassification", {
      title: "Add New Classification",
      messages: req.flash(),
      nav,
    });
  }

  try {
    const result = await invModel.addClassification(className);
    if (result.rowCount > 0) {
      req.flash("success", "Classification added successfully!");
      return res.redirect("/inv/add-classification"); 
    } else {
      req.flash("error", "Failed to add classification.");
      return res.render("inventory/addClassification", {
        title: "Add New Classification",
        messages: req.flash(),
        nav,
      });
    }
  } catch (error) {
    console.error("Error adding classification: ", error);
    req.flash("error", "An unexpected error occurred.");
    return res.render("inventory/addClassification", {
      title: "Add New Classification",
      messages: req.flash(),
      nav,
    });
  }
};

invCont.showAddInventoryForm = async (req, res) => {
  try {
    let nav = await utilities.getNav();
    const classificationList = await invModel.getClassifications();

    res.render("inventory/addInventory", {
      title: "Add New Vehicle",
      classificationList: classificationList.rows,
      messages: req.flash('messages'),
      nav
    });
  } catch (error) {
    console.error("Error displaying add inventory form: " + error);
    req.flash('messages', 'Error loading the form. Please try again later.');
    res.redirect("/inv/management");
  }
};

invCont.addInventory = async (req, res) => {
  try {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    await invModel.addInventory({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });

    req.flash('messages', 'Inventory item added successfully');
    res.redirect('/inv/add-inventory');
  } catch (error) {
    console.error("Error adding inventory item: ", error);
    req.flash('messages', 'Error adding inventory item. Please try again later.');
    res.redirect('/inv/add-inventory');
  }
};

invCont.updateInventory  = async (req, res, next) => {
  try {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    const updateResult = await invModel.updateInventory({
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });

    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/management")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
  } catch (error) {
    console.error("Error adding inventory item: ", error);
    req.flash('messages', 'Error adding inventory item. Please try again later.');
    res.redirect('/inv/add-inventory');
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationList = await invModel.getClassifications()
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList.rows,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationList = await invModel.getClassifications()
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/deleteInventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList.rows,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price
  })
}

/* ***************************
 *  Delete inventory view
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  let nav = await utilities.getNav()
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult) {
    req.flash("notice", 'The deletion was successful.')
    res.redirect("/inv/management")
  } else { 
    req.flash("notice", 'Sorry, the delete failed.')
    res.redirect("/inv/delete/inv_id")
  }
}

module.exports = invCont