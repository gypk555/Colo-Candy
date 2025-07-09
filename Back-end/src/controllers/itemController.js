import {getItems, addItem, deleteItem} from "../models/itemsModels.js";

// const getAllItems = async (req, res) => {
//   try {
//     const items = await getItems();
//     res.json(items);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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
    console.log("api request rcieved ");
    // res.send('<h1> Hello from back end</h1>');
    console.log(req.body.name, " ");
    const { name, description, price} = req.body;
    const image =req.file ? req.file.buffer : null; // Extract image from multer
    console.log("Data received:", { name, description, price, imageSize: image?.length });

    const newItem = await addItem(name, description, price, image);
    res.status(201).json(newItem);
  } catch (error) {
    console.log("I am from createItem in back end");
    res.status(500).json({ error: error.message });
    console.log({error: error.message});
  }
};

const removeItem = async (req, res) => {
  try {
    const { id } = req.body;
    console.log("the id of the deleting item ",id);
    const deleted = await deleteItem(id);
    if (deleted) {
      res.json({ message: "Item deleted successfully" });
    } else {
      res.status(404).json({ error: "Item not found" });
    }
  } catch (error) {
    console.log("error is ",{error: error.message});
    res.status(500).json({ error: error.message });
  }
};

export { getAllItems, createItem, removeItem };
