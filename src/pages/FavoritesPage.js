import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";
import "./Home.css"; // Reusing Home.css for consistent styling

function FavoritesPage() {
  const { favorites, dispatch } = useFavorites();

  const removeFromFavorites = (product) => {
    dispatch({ type: "REMOVE_FROM_FAVORITES", payload: product });
    toast.success("Removed from favorites!");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="star-icon filled" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star-icon filled" />);
      } else {
        stars.push(<FaRegStar key={i} className="star-icon" />);
      }
    }
    return stars;
  };

  return (
    <div className="home-container">
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="page-title gradient-text"
      >
        Your Favorites
      </motion.h1>
      <div className="products-grid">
        {favorites.length === 0 ? (
          <div className="no-results glass-effect">
            <p className="neon-effect">No favorite products yet.</p>
          </div>
        ) : (
          favorites.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <Link to={`/product/${product.id}`}>
                  <img src={product.image} alt={product.title} />
                </Link>
              </div>
              <div className="content">
                <Link to={`/product/${product.id}`}>
                  <h3 className="product-title neon-effect">{product.title}</h3>
                  <p className="product-price">${product.price.toFixed(2)}</p>
                </Link>
                <div className="rating-favorite-container">
                  <div className="star-rating">
                    {renderStars(product.rating.rate)}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => removeFromFavorites(product)}
                    className="favorite-btn"
                    aria-label="Remove from favorites"
                  >
                    <FaHeart className="heart-icon filled" />
                  </motion.button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;