const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleDetails(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [vehicle_id]
    )
    return data.rows
  } catch (error) {
    console.error("getVehicleDetails error " + error)
  }
}

async function addClassification(name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [name])
  } catch (error) {
    return error.message
  }
}

async function addInventory(data) {
  try {
      const sql = `
          INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id`;
      const values = [data.inv_make, data.inv_model, data.inv_year, data.inv_description, data.inv_image, data.inv_thumbnail, data.inv_price, data.inv_miles, data.inv_color, data.classification_id];

      const result = await pool.query(sql, values);
      return result.rows[0];
  } catch (error) {
      console.error("Error adding inventory to the database: " + error);
      throw error;
  }
}

async function getInventoryById(id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [id]
    )
    return data.rows
  } catch (error) {
    console.error("getVehicleDetails error " + error)
  }
}

async function updateInventory(data) {
  try {
      const sql = `UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *`;
      const values = [
        data.inv_make,
        data.inv_model, 
        data.inv_year, 
        data.inv_description, 
        data.inv_image, 
        data.inv_thumbnail, 
        data.inv_price, 
        data.inv_miles, 
        data.inv_color, 
        data.classification_id, 
        data.inv_id
      ];
      const result = await pool.query(sql, values);

      return result.rows[0];
  } catch (error) {
      console.error("Error adding inventory to the database: " + error);
      throw error;
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

module.exports = { 
  getClassifications, 
  getInventoryByClassificationId, 
  getVehicleDetails, 
  addClassification,
  addInventory,
  getInventoryById,
  updateInventory,
  deleteInventoryItem
};