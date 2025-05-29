import axios from 'axios';
import { generateFakeProducts } from './fakeData';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fall back to fake data
    return generateFakeProducts(20);
  }
};

// Get a single product
export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    // Fall back to fake data
    const fakeProducts = generateFakeProducts(20);
    return fakeProducts.find(p => p.id === parseInt(productId)) || fakeProducts[0];
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await api.get('/products/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fall back to fake categories
    return ['electronics', 'jewelery', "men's clothing", "women's clothing"];
  }
};

// Get products in a specific category
export const getProductsByCategory = async (category) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    // Fall back to fake data filtered by category
    const fakeProducts = generateFakeProducts(20);
    return fakeProducts.filter(p => p.category === category);
  }
};

export default api;