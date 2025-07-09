// import { pool } from "../config/db.js";
import pool from "../config/db.js"

const getItems = async () => {
  const result = await pool.query("SELECT * FROM items");
  return result.rows;
};

const addItem = async (name, description, price, image) => {
  console.log("I am from addItem function inserting item into database ");
  const result = await pool.query(
    "INSERT INTO items (name, description, price, image) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, price, image]
  );
  return result.rows[0];
};

const deleteItem = async (id) => {
  const result = await pool.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
  return result.rowCount;
};

export { getItems, addItem, deleteItem };
