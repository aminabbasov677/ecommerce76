import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";
import "./Search.css";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    sortOrder: "",
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const productsPerPage = 9;
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");
  const { dispatch } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(products.map((product) => product.category)),
        ];
        setCategories(uniqueCategories);

        if (query) {
          const filteredProducts = products.filter((product) => {
            const searchTerms = query.toLowerCase().split(" ");
            const productText =
              `${product.title} ${product.description} ${product.category}`.toLowerCase();
            return searchTerms.every((term) => productText.includes(term));
          });
          setSearchResults(filteredProducts);
          setFilteredResults(filteredProducts);
        } else {
          setSearchResults([]);
          setFilteredResults([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    setCurrentPage(1);
  }, [query]);

  const applyFilters = () => {
    let results = [...searchResults];

    // Price filtering
    if (filters.minPrice !== "") {
      results = results.filter(
        (product) => product.price >= parseFloat(filters.minPrice)
      );
    }
    if (filters.maxPrice !== "") {
      results = results.filter(
        (product) => product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Category filtering
    if (filters.categories.length > 0) {
      results = results.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Sorting
    if (filters.sortOrder === "asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortOrder === "desc") {
      results.sort((a, b) => b.price - a.price);
    }

    setFilteredResults(results);
    setCurrentPage(1);
    setIsFilterOpen(false);
    toast.success("Filters applied!");
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((cat) => cat !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
  };

  const resetFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      sortOrder: "",
      categories: [],
    });
    setFilteredResults(searchResults);
    setCurrentPage(1);
    setIsFilterOpen(false);
    toast.success("Filters reset!");
  };

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success("Added to cart!");
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredResults.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredResults.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

  if (loading) {
    return React.createElement('div',
      { className: 'loading-container glass-effect' },
      React.createElement('div', { className: 'loading-spinner' })
    );
  }

  if (error) {
    return React.createElement(
      'div',
      { className: 'error-container glass-effect' },
      React.createElement(
        'p',
        { className: 'neon-effect' },
        'Error: ',
        error.message
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'home-container' },
    React.createElement(
      'div',
      { className: 'flex justify-between items-center mb-4' },
      React.createElement(
        motion.h1,
        {
          initial: { y: -20 },
          animate: { y: 0 },
          className: 'page-title gradient-text'
        },
        query ? `Search Results for "${query}"` : 'Search Products'
      ),
      React.createElement(
        motion.button,
        {
          whileHover: { scale: 1.1 },
          whileTap: { scale: 0.9 },
          className: 'filter-btn',
          onClick: () => setIsFilterOpen(true)
        },
        React.createElement(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            className: 'h-6 w-6',
            fill: 'none',
            viewBox: '0 0 24 24',
            stroke: 'currentColor'
          },
          React.createElement('path', {
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M3 4a1 1 0 011-1h16a1 1 0 011 1m-1 4H5m8 4H5m8 4H5'
          })
        ),
        'Filters'
      )
    ),
    React.createElement(
      AnimatePresence,
      null,
      isFilterOpen && React.createElement(
        motion.div,
        {
          className: 'filter-modal glass-effect',
          initial: { opacity: 0, y: '-100%' },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: '-100%' },
          transition: { type: 'spring', stiffness: 300, damping: 20 }
        },
        React.createElement(
          'div',
          { className: 'filter-content' },
          React.createElement(
            motion.h2,
            {
              className: 'filter-title neon-effect',
              initial: { opacity: 0 },
              animate: { opacity: 1 }
            },
            'Filter Products'
          ),
          React.createElement(
            'div',
            { className: 'filter-section' },
            React.createElement('h3', { className: 'filter-subtitle' }, 'Price Range'),
            React.createElement(
              'div',
              { className: 'flex gap-4' },
              React.createElement('input', {
                type: 'number',
                placeholder: 'Min Price',
                value: filters.minPrice,
                onChange: (e) => setFilters({ ...filters, minPrice: e.target.value }),
                className: 'filter-input',
                min: '0'
              }),
              React.createElement('input', {
                type: 'number',
                placeholder: 'Max Price',
                value: filters.maxPrice,
                onChange: (e) => setFilters({ ...filters, maxPrice: e.target.value }),
                className: 'filter-input',
                min: '0'
              })
            )
          ),
          React.createElement(
            'div',
            { className: 'filter-section' },
            React.createElement('h3', { className: 'filter-subtitle' }, 'Sort By Price'),
            React.createElement(
              'div',
              { className: 'flex sort-order-container' },
              React.createElement(
                'label',
                { className: 'flex items-center gap-2' },
                React.createElement('input', {
                  type: 'radio',
                  name: 'sortOrder',
                  value: 'asc',
                  checked: filters.sortOrder === 'asc',
                  onChange: (e) => setFilters({ ...filters, sortOrder: e.target.value }),
                  className: 'filter-radio'
                }),
                'Ascending'
              ),
              React.createElement(
                'label',
                { className: 'flex items-center gap-2' },
                React.createElement('input', {
                  type: 'radio',
                  name: 'sortOrder',
                  value: 'desc',
                  checked: filters.sortOrder === 'desc',
                  onChange: (e) => setFilters({ ...filters, sortOrder: e.target.value }),
                  className: 'filter-radio'
                }),
                'Descending'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'filter-section' },
            React.createElement('h3', { className: 'filter-subtitle' }, 'Categories'),
            React.createElement(
              'div',
              { className: 'flex flex-wrap gap-2' },
              categories.map((category) => React.createElement(
                motion.label,
                {
                  key: category,
                  className: 'filter-checkbox-label',
                  whileHover: { scale: 1.05 }
                },
                React.createElement('input', {
                  type: 'checkbox',
                  checked: filters.categories.includes(category),
                  onChange: () => handleCategoryChange(category),
                  className: 'filter-checkbox'
                }),
                category
              ))
            )
          ),
          React.createElement(
            'div',
            { className: 'filter-buttons' },
            React.createElement(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: 'filter-save-btn',
                onClick: applyFilters
              },
              'Save'
            ),
            React.createElement(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: 'filter-reset-btn',
                onClick: resetFilters
              },
              'Reset'
            ),
            React.createElement(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: 'filter-close-btn',
                onClick: () => setIsFilterOpen(false)
              },
              'Close'
            )
          )
        )
      )
    ),
    filteredResults.length === 0 ? React.createElement(
      'div',
      { className: 'no-results glass-effect' },
      React.createElement(
        'p',
        { className: 'neon-effect' },
        query ? 'No products found matching your search or filters.' : 'Enter a search term to find products.'
      )
    ) : React.createElement(
      React.Fragment,
      null,
      React.createElement(
        'div',
        { className: 'products-grid' },
        currentProducts.map((product) => React.createElement(
          motion.div,
          {
            key: product.id,
            initial: { opacity: 0, scale: 0.8, y: 50 },
            animate: { opacity: 1, scale: 1, y: 0 },
            whileHover: {
              y: -10,
              scale: 1.05,
              boxShadow: '0 0 20px var(--neon-pink)'
            },
            transition: { type: 'spring', stiffness: 300, damping: 20 },
            className: 'product-card'
          },
          React.createElement(
            'div',
            { className: 'product-image' },
            React.createElement(
              Link,
              { to: `/product/${product.id}` },
              React.createElement('img', { src: product.image, alt: product.title })
            )
          ),
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              Link,
              { to: `/product/${product.id}` },
              React.createElement('h3', { className: 'product-title neon-effect' }, product.title),
              React.createElement('p', { className: 'product-price' }, '$', product.price.toFixed(2))
            ),
            React.createElement(
              'div',
              { className: 'rating-favorite-container' },
              React.createElement(
                'div',
                { className: 'star-rating' },
                renderStars(product.rating.rate)
              ),
              React.createElement(
                'button',
                {
                  className: 'favorite-btn',
                  onClick: () => toggleFavorite(product),
                  'aria-label': favorites.some(fav => fav.id === product.id) ? "Remove from favorites" : "Add to favorites"
                },
                React.createElement(
                  FaHeart,
                  {
                    className: `heart-icon ${favorites.some(fav => fav.id === product.id) ? "filled" : ""}`
                  }
                )
              )
            )
          )
        ))
      ),
      totalPages > 1 && React.createElement(
        'div',
        { className: 'pagination-container' },
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: `pagination-btn ${currentPage === 1 ? 'disabled' : ''}`,
            onClick: () => handlePageChange(currentPage - 1),
            disabled: currentPage === 1
          },
          'Previous'
        ),
        React.createElement(
          'span',
          { className: 'pagination-current' },
          currentPage,
          ' / ',
          totalPages
        ),
        React.createElement(
          motion.button,
          {
            whileHover: { scale: 1.1 },
            whileTap: { scale: 0.9 },
            className: `pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`,
            onClick: () => handlePageChange(currentPage + 1),
            disabled: currentPage === totalPages
          },
          'Next'
        )
      )
    )
  );
};

export default Search;
