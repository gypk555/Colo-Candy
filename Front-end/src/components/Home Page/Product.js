
// import {React} from "react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductGrid.css";



// const products = [
//   {
//     id: 1,
//     name: "Dark Brown Stitchless Stripes Polo T-Shirt",
//     price: "INR 1,399",
//     sizes: ["S", "M", "L", "XL", "XXL"],
//     image: "#", // Replace with actual image URLs
//   },
//   {
//     id: 2,
//     name: "Olive Stitchless Stripes Polo T-Shirt",
//     price: "INR 1,399",
//     sizes: ["S", "M", "L", "XL", "XXL"],
//     image: "#",
//   },
//   {
//     id: 3,
//     name: "Brown Stitchless Stripes Polo T-Shirt",
//     price: "INR 1,399",
//     sizes: ["S", "M", "L", "XL", "XXL"],
//     image: "#",
//   },
//   {
//     id: 4,
//     name: "Grey Slim Fit Jeans",
//     price: "INR 1,699",
//     sizes: ["30", "32", "34", "36", "38"],
//     image: "#",
//   },
//   {
//     id: 5,
//     name: "Black Graphic Print Oversized Fit T-Shirt",
//     price: "INR 1,099",
//     sizes: ["XS", "S", "M", "L", "XL", "XXL"],
//     image: "#",
//   },
//   {
//     id: 6,
//     name: "Grey Slim Fit Jeans",
//     price: "INR 1,699",
//     sizes: ["30", "32", "34", "36", "38"],
//     image: "#",
//   },
//   {
//     id: 7,
//     name: "Black Graphic Print Oversized Fit T-Shirt",
//     price: "INR 1,099",
//     sizes: ["XS", "S", "M", "L", "XL", "XXL"],
//     image: "#",
//   },
//   {
//     id: 8,
//     name: "Grey Slim Fit Jeans",
//     price: "INR 1,699",
//     sizes: ["30", "32", "34", "36", "38"],
//     image: "#",
//   },
//   {
//     id: 9,
//     name: "Black Graphic Print Oversized Fit T-Shirt",
//     price: "INR 1,099",
//     sizes: ["XS", "S", "M", "L", "XL", "XXL"],
//     image: "#",
//   },
//   {
//     id: 10,
//     name: "Grey Slim Fit Jeans",
//     price: "INR 1,699",
//     sizes: ["30", "32", "34", "36", "38"],
//     image: "#",
//   },
//   {
//     id: 11,
//     name: "Black Graphic Print Oversized Fit T-Shirt",
//     price: "INR 1,099",
//     sizes: ["XS", "S", "M", "L", "XL", "XXL"],
//     image: "#",
//   },
//   {
//     id: 12,
//     name: "Black Graphic Print Oversized Fit T-Shirt",
//     price: "INR 1,099",
//     sizes: ["XS", "S", "M", "L", "XL", "XXL"],
//     image: "#",
//   }
// ];

var items=[];

const ProductGrid = () => {
  const navigate = useNavigate();
  const [products, setItems] = useState([]); // Stores all items fetched from the database
  // Fetch items from the database
  const fetchItems = async () => {
    try {
      console.log("Fetching items from the database...");
      const response = await axios.get(process.env.ADMIN_URL);
      setItems(response.data);
      items=response.data;
      console.log("Items fetched successfully:", response.data);
      console.log("these are the items ", items);
    } catch (error) {
      console.error("Error fetching items:", error.response?.data || error.message);
    }
  };

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);


  return (
    <div className="product-grid">
      {products.map((product) => (
        <div className="product-card" 
          key={product.id}
          onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
          style={{ cursor: "pointer" }}
        >
          {/* <img src={product.image} alt={product.name} className="product-image"/> */}

          { /*{item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: "100px" }} />} */}
              {product.image && (
                <img className="product-image"
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  style={{ width: "100px" }}
                />
              )}


          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">INR {product.price}</p>
            {/* <div className="product-sizes">
              {product.sizes.map((size) => (
                <span key={size} className="product-size">
                  {size}
                </span>
              ))}       
            </div> */}
            <p>{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// export {ProductGrid};
export {ProductGrid, items};
