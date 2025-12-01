import React, { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch items from the database
  const fetchItems = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_ADMIN_URL);
      setItems(response.data);
    } catch (error) {
      setError("Failed to fetch items. Please try again.");
    }
  };

  // Add a new item to the database
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("description", newItem.description);
    formData.append("price", newItem.price);
    formData.append("brand", newItem.brand);
    formData.append("image", newItem.image);

    try {
      await axios.post(process.env.REACT_APP_ADMIN_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Item added successfully!");
      fetchItems();
      setNewItem({ name: "", description: "", price: "", brand: "", image: null });
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an item from the database
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await axios.delete(process.env.REACT_APP_ADMIN_URL, { data: { id } });
      setSuccess("Item deleted successfully!");
      fetchItems();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete item. Please try again.");
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
    if (file) {
      setNewItem({ ...newItem, image: file });
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="flex flex-col items-center bg-gray-200 p-5 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 max-w-md w-full" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 max-w-md w-full" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {/* Form to add a new item */}
      <form onSubmit={handleAddItem} className="flex flex-col gap-3 p-5 px-12 bg-white rounded shadow-md mb-5 w-full max-w-md">
        <h3 className="flex justify-center text-xl font-semibold">Add New Item</h3>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={newItem.name}
          onChange={handleInputChange}
          required
          className="h-8 rounded border-2 border-cyan-200 px-2 outline-none focus:border-cyan-400"
        />
        <textarea
          name="description"
          placeholder="Item Description"
          value={newItem.description}
          onChange={handleInputChange}
          required
          className="h-12 rounded border-2 border-cyan-200 px-2 py-1 outline-none focus:border-cyan-400 resize-none"
        />
        <input
          type="text"
          name="brand"
          placeholder="Brand Name"
          value={newItem.brand}
          onChange={handleInputChange}
          required
          className="h-8 rounded border-2 border-cyan-200 px-2 outline-none focus:border-cyan-400"
        />
        <input
          type="number"
          name="price"
          placeholder="Item Price"
          value={newItem.price}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          className="h-8 rounded border-2 border-cyan-200 px-2 outline-none focus:border-cyan-400"
        />
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          required
          accept="image/*"
          className="h-8"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white border-none rounded h-10 cursor-pointer hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </form>

      {/* List of items with options for CRUD operations */}
      <h3 className="text-xl font-semibold mb-3">Manage Items</h3>
      <div className="w-full max-w-6xl">
        <div className="hidden md:flex flex-row font-semibold mb-2 px-2">
          <h4 className="w-28">Name</h4>
          <h4 className="w-20">Brand</h4>
          <h4 className="w-40">Description</h4>
          <h4 className="w-20">Price</h4>
          <h4 className="w-28">Image</h4>
          <h4 className="w-24">Action</h4>
        </div>
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between md:justify-start border border-gray-300 p-2.5 mb-2.5 rounded bg-white gap-2">
              <h6 className="w-full md:w-28 text-base font-semibold">{item.name}</h6>
              <p className="w-full md:w-20 text-sm font-medium text-blue-600">{item.brand || 'N/A'}</p>
              <p className="w-full md:w-40 text-sm text-gray-700 truncate" title={item.description}>
                {item.description}
              </p>
              <p className="w-full md:w-20 text-sm font-medium">${item.price}</p>
              {item.image && (
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="w-24 h-24 md:w-28 object-cover rounded"
                />
              )}
              <button
                className="h-8 bg-red-500 hover:bg-red-600 border-none text-white px-3 rounded cursor-pointer transition-colors w-full md:w-24"
                onClick={() => handleDeleteItem(item.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No items found.</p>
        )}
      </div>
    </div>
  );
}

export default Admin;
