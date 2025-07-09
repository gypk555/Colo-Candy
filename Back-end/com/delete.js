router.delete("/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await pool.query("DELETE FROM items WHERE id = $1", [id]);
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting item:", error.message);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });
  