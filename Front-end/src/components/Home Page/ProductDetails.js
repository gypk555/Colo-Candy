import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
// import { items } from "./Product";



// var products=items;

const ProductDetails = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  // Get product object from location.state
  const product = location.state?.product;
  // const product = items.find((item) => item.id === parseInt(id));
  if (!product) return <h2>Product Not Found</h2>;

  return (
    <div className="product-details">
      <div className="image-container">
        { /*{item.imageUrl && <img src={item.imageUrl} alt={item.name} style={{ width: "100px" }} />} */}
              {product.image && (
                <img className="product-image"
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.name}
                  style={{ width: "100px" }}
                />
              )}
      </div>
      <div className="details-container">
        <h2>{product.name}</h2>
        <p className="price">{product.price}</p>
        <p>{product.description}</p>
        {/* <div className="sizes">
          <strong>Sizes:</strong> {product.sizes.join(", ")}
        </div> */}
        <button className="add-to-cart">Add to Cart</button>
        <button className="buy-now">Buy Now</button>
        <button className="share">🔗 Share</button>
        <button className="back-home" onClick={() => navigate("/")}>
          ⬅️ Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
