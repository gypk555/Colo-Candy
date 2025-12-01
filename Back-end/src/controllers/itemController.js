import {getItems, addItem, deleteItem} from "../models/itemsModels.js";
import { compressProductImage } from "../utils/imageCompression.js";

const getAllItems = async (req, res) => {
  try {
    const items = await getItems();

    // Convert image buffer to Base64
    const itemsWithBase64Images = items.map(item => ({
      ...item,
      image: item.image ? item.image.toString("base64") : null, // Convert buffer to base64
    }));

    res.json(itemsWithBase64Images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createItem = async (req, res) => {
  try {
    console.log("api request received");
    const { name, description, price, brand } = req.body;
    let image = req.file ? req.file.buffer : null; // Extract image from multer

    if (image) {
      console.log(`🖼️ Compressing product image: ${name} (${(image.length / 1024).toFixed(2)} KB)`);
      // Compress the product image
      image = await compressProductImage(image, req.file.mimetype);
      console.log(`✅ Image compressed: (${(image.length / 1024).toFixed(2)} KB)`);
    }

    console.log("Data received:", { name, description, price, brand, imageSize: image?.length });

    const newItem = await addItem(name, description, price, brand, image);
    res.status(201).json(newItem);
  } catch (error) {
    console.log("Error in createItem:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("Deleting item with id:", id);
    const deleted = await deleteItem(id);
    if (deleted) {
      res.json({ message: "Item deleted successfully" });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.log("Error in removeItem:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export { getAllItems, createItem, removeItem };
