const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
};

async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
};

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

async function getAccountById(accountId) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1";
    const result = await pool.query(sql, [accountId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    return null;
  }
}

async function updateAccount(data) {
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4";
    return await pool.query(sql, [data.fname, data.lname, data.email, data.id]);
  } catch (error) {
    console.error("Error fetching account by ID:", error);
    return null;
  }
}

async function updatePassword(id, hashedPassword) {
  const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2";
  return await pool.query(sql, [hashedPassword, id]);
}

async function accountsList() {
  try {
    const sql = "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account ORDER BY account_id"
    const result = await pool.query(sql)
    return result.rows;
  } catch (error) {
    return error.message
  }
}

module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
  accountsList
};  