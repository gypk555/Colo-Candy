router.get("/", async (req, res) => {
    try {
      const items = await pool.query("SELECT * FROM items");
      res.json(items.rows);
    } catch (error) {
      console.error("Error fetching items:", error.message);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });
  