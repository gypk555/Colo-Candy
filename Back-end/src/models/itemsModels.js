import pool from "../config/db.js";

const getItems = async () => {
  const result = await pool.query("SELECT * FROM items");
  return result.rows;
};

const addItem = async (name, description, price, image, brand) => {
  console.log("Inserting item into database");
  const result = await pool.query(
    "INSERT INTO items (name, description, price, image, brand) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, description, price, image, brand]
  );
  return result.rows[0];
};

const deleteItem = async (id) => {
  const result = await pool.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
  return result.rowCount;
};

export { getItems, addItem, deleteItem };
