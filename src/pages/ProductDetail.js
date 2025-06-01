import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaStar, FaRegStar, FaFacebook, FaTwitter, FaWhatsapp, FaUser, FaHeart, FaBrain, FaShoppingCart, FaTrash } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import "./ProductDetail.css";
import "./Home.css";

function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [loading, setLoading] = useState(false);

  const initialReviews = [
    { id: 1, username: "John Doe", comment: "Great product, highly recommend!", rating: 4 },
    { id: 2, username: "Jane Smith", comment: "Amazing quality, fast shipping!", rating: 5 },
    { id: 3, username: "Alex Lee", comment: "Pretty good, but could be better.", rating: 3 },
  ];

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(`product_reviews_${id}`);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem(`product_ratings_${id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetch(`https://fakestoreapi.com/products/${id}`).then(res => res.json()),
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ["related_products", product?.category],
    queryFn: () =>
      fetch(`https://fakestoreapi.com/products/category/${product.category}`).then(res => res.json()),
    enabled: !!product,
  });

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
    toast.success(`${quantity} item${quantity > 1 ? "s" : ""} added to cart!`);
    setQuantity(1); // Reset quantity after adding to cart
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!userReview.trim()) {
      toast.error("Please enter a review.");
      return;
    }

    const newReview = {
      id: Date.now(),
      username: user?.name || "Anonymous",
      userEmail: user?.email,
      comment: userReview,
      rating: userRating,
    };

    const updatedReviews = [...reviews, newReview];
    setReviews(updatedReviews);
    localStorage.setItem(`product_reviews_${id}`, JSON.stringify(updatedReviews));
    setUserReview("");
    setUserRating(0);
    toast.success("Review submitted!");
  };

  const handleDeleteReview = (reviewId) => {
    const updatedReviews = reviews.filter(review => review.id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem(`product_reviews_${id}`, JSON.stringify(updatedReviews));
    toast.success("Review deleted successfully!");
  };

  const handleRatingSubmit = () => {
    if (!userRating) return;
    const updatedRatings = [...ratings, userRating];
    setRatings(updatedRatings);
    localStorage.setItem(`product_ratings_${id}`, JSON.stringify(updatedRatings));
    toast.success("Rating submitted!");
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

  const StarRatingInput = () => {
    return (
      <div className="star-rating-input">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-button ${userRating >= star ? "filled" : ""}`}
            onClick={() => setUserRating(star)}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (!ratings.length) return product.rating.rate;
    const totalRatings = ratings.reduce((sum, rating) => sum + rating, 0);
    const apiRatingSum = product.rating.rate * product.rating.count;
    return ((apiRatingSum + totalRatings) / (product.rating.count + ratings.length)).toFixed(1);
  };

  const shareOnSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this product: ${product.title}`);
    let shareUrl;

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
  };

  // Quantity change handlers
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    setLoading(true);
    addToCart();
    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="loading-container glass-effect">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container glass-effect">
        <p>Product failed to load. Please try again.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="product-detail-container"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className="back-button"
      >
        Back
      </motion.button>
      <div className="product-detail">
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="product-image-container"
        >
          <img src={product.image} alt={product.title} className="product-image" />
        </motion.div>
        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="product-info"
        >
          <h1 className="product-title">{product.title}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          <div className="product-price-container">
            <span className="product-price">${product.price}</span>
            <div className="product-rating">
              <span className="star-rating">{renderStars(calculateAverageRating())}</span>
              <span>({product.rating.count + ratings.length} reviews)</span>
            </div>
          </div>
          <div className="product-actions">
            <div className="quantity-container">
              <div className="quantity-selector">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={decreaseQuantity}
                  className="quantity-btn"
                  aria-label="Decrease quantity"
                >
                  -
                </motion.button>
                <span className="quantity-display">{quantity}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={increaseQuantity}
                  className="quantity-btn"
                  aria-label="Increase quantity"
                >
                  +
                </motion.button>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <>
                    <FaShoppingCart className="cart-icon" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="reviews-section">
        <h2 className="section-title">Customer Reviews</h2>
        <form onSubmit={handleReviewSubmit} className="review-form">
          <textarea
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            placeholder="Write your review here..."
            className="review-textarea"
            rows="4"
          />
          <div className="review-actions">
            <StarRatingInput />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="submit-review-button"
            >
              Submit Review
            </motion.button>
          </div>
        </form>
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <FaUser className="user-icon" />
                <span className="username">{review.username}</span>
                {user && review.userEmail === user.email && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteReview(review.id)}
                    className="delete-review-btn"
                    aria-label="Delete review"
                  >
                    <FaTrash className="trash-icon" />
                  </motion.button>
                )}
              </div>
              <div className="review-rating">{renderStars(review.rating)}</div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="social-share-section">
        <h2 className="section-title">Share</h2>
        <div className="social-buttons">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => shareOnSocial("facebook")}
            className="social-button facebook"
            aria-label="Share on Facebook"
          >
            <FaFacebook />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => shareOnSocial("twitter")}
            className="social-button twitter"
            aria-label="Share on Twitter"
          >
            <FaTwitter />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => shareOnSocial("whatsapp")}
            className="social-button whatsapp"
            aria-label="Share on WhatsApp"
          >
            <FaWhatsapp />
          </motion.button>
        </div>
      </div>
      <div className="related-products-section">
        <h2 className="section-title">You May Also Like</h2>
        <div className="products-grid">
          {relatedProducts
            .filter((p) => p.id !== parseInt(id))
            .slice(0, 4)
            .map((p) => (
              <motion.div
                key={p.id}
                className="product-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
              >
                <div className="product-image">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.image} alt={p.title} />
                  </Link>
                </div>
                <div className="content">
                  <Link to={`/product/${p.id}`}>
                    <h3 className="product-title">{p.title}</h3>
                    <p className="product-price">${p.price.toFixed(2)}</p>
                  </Link>
                  <div className="rating-favorite-container">
                    <div className="star-rating">
                      {renderStars(p.rating.rate)}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="favorite-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(p);
                      }}
                      aria-label={favorites.some(fav => fav.id === p.id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <FaHeart
                        className={`heart-icon ${favorites.some(fav => fav.id === p.id) ? "filled" : ""}`}
                        style={{ color: favorites.some(fav => fav.id === p.id) ? "#ff4d4d" : "#00ffc3" }}
                      />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
      <Link to={{ pathname: "/chat", state: { product } }}>
        <motion.div
          className="ai-assistant-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          aria-label="Open AI Assistant"
        >
          <FaBrain className="ai-icon" />
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default ProductDetail;