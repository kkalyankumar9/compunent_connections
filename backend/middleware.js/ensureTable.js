const database = require("../db");

const ensureTable = async (req, res, next) => {
  console.log("Ensuring 'taskslist' table exists...");

  const query = `CREATE TABLE IF NOT EXISTS taskslist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(255) 
  )`;

  try {
    await database.query(query, { type: database.QueryTypes.RAW });
    console.log("Table 'taskslist' created or already exists.");
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Error creating 'taskslist' table:", err);
    next(err); // Pass error to Express error handler middleware
  }
};

module.exports = ensureTable;
