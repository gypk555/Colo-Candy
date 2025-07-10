import "./Admin.css";

import React, { useState, useEffect } from "react";
import axios from "axios";


function Admin() {
  const [items, setItems] = useState([]); // Stores all items fetched from the database
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image: null, // For storing the selected image
  });

  // Fetch items from the database
  const fetchItems = async () => {
    try {
      console.log("Fetching items from the database...");
      const response = await axios.get(process.env.ADMIN_URL);
      setItems(response.data);
      console.log("Items fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching items:", error.response?.data || error.message);
    }
  };

  // Add a new item to the database
  const handleAddItem = async (e) => {
    e.preventDefault();
    console.log("item info before sending api request ");
    console.log(newItem.name, newItem.author,newItem.description,newItem.price);
    const formData = new FormData(); // For sending image and data together
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("price", newItem.price);
    formData.append("image", newItem.image);

    try {
      console.log("Adding new item to the database...");
      console.log("sending api request to add item");
      console.log(formData.get("name"), formData.get("description"), formData.get("price"));
      const response = await axios.post(process.env.ADMIN_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Item added successfully:", response.data);
      alert("Item added successfully!");
      fetchItems(); // Refresh the items list
      setNewItem({ name: "", description: "", price: "", image:null}); // Reset the form
    } catch (error) {
      console.error("Error adding item:", error.response?.data || error.message);
      alert("Failed to add item. Please try again.");
    }
  };

  // Delete an item from the database
  const handleDeleteItem = async (id) => {
    try {
      console.log(`Deleting item with ID: ${id}`);
      const response = await axios.delete(process.env.ADMIN_URL, {data: { id }});
      console.log("Item deleted successfully:", response.data);
      alert("Item deleted successfully!");
      fetchItems(); // Refresh the items list
    } catch (error) {
      console.error("Error deleting item:", error.response?.data || error.message);
      alert("Failed to delete item. Please try again.");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  // Handle image file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setNewItem({ ...newItem, image: file});
    }
    // setNewItem({ ...newItem, image: e.target.files[0] });
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: "20px" }} className="Admin-dassboard">
      <h2>Admin Dashboard</h2>

      {/* Form to add a new item */}
      <form onSubmit={handleAddItem} style={{ marginBottom: "20px" }} className="form-style">
        <h3>Add New Item</h3>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={newItem.name}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="description"
          placeholder="Item Description"
          value={newItem.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Item Price"
          value={newItem.price}
          onChange={handleInputChange}
          required
        />
        <input type="file" name="image" onChange={handleImageChange} required />
        <button type="submit" className="Add-button">Add Item</button>
      </form>

      {/* List of items with options for CRUD operations */}
      <h3>Manage Items</h3>
      <div>
        <div className="items-Display-headings">
          <h4>Name</h4>  
          <h4>Description</h4>  
          <h4>Price</h4>
          {/* <h4>Image</h4>   */}
          <h4>Action</h4> 
        </div>
        {items.length > 0 ? (
          items.map((item) => (
            
            <div key={item.id} className="items-Display" style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
              <h6>{item.name}</h6>
              <p>{item.description}</p>
              <p>Price: ${item.price}</p>
              { /*{item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: "100px" }} />} */}
              {item.image && (
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  style={{ width: "100px" }}
                />
              )}

              <button className="delete-button" onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
