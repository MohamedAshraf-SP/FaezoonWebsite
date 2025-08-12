import axios from "axios";
const api = import.meta.env.VITE_API_Tutorial_URL;

// Centralized error handling
const handleError = (error, action) => {
  console.error(`Error ${action}:`, error);
  throw new Error(`Error ${action}: ${error.message}`);
};

// Generic API call
const apiCall = async (method, path, data = null) => {
  try {
    const response = await axios({
      method,
      url: `${api}/${path}`,
      data,
    });
    return response.data;
  } catch (error) {
    handleError(error, method);
  }
};

// Get one item
export const getItem = async (path, itemId) => {
  return apiCall("GET", `${path}/${itemId}`);
};

// Get all items
export const getAllItems = async (path) => {
  return apiCall("GET", path);
};

// Search for items
export const searchWithWord = async (path, searchWord) => {
  return apiCall("POST", path, { searchWord });
};

// Add a new item
export const addNewItem = async (newItem, path) => {
  return apiCall("POST", path, newItem);
};

// Edit an existing item
export const editItem = async (path, itemId, updatedItem) => {
  return apiCall("PUT", `${path}/${itemId}`, updatedItem);
};
// Delete an item
export const deleteItem = async (path, itemId) => {
  return apiCall("DELETE", `${path}/${itemId}`);
};
// get Duaa Ctegories
export const getDuaaCategories = async (path) => {
  try {
    const response = await axios.get(`${api}/${path}/types`);
    return response.data;
  } catch (error) {
    console.log("error get categories", error);
  }
};
// fetch category Duaas
export const getItemsByCategory = async (path, categoryName) => {
  try {
    const response = await axios.get(`${api}/${path}/by-type/${categoryName}`);
    return response?.data;
  } catch (error) {
    console.log("Error getting items by category:", error);
  }
};

// get category count
export const getCount = async (path) => {
  try {
    const data = await axios.get(`${api}/${path}/count/`);
    return data.data;
  } catch (error) {
    console.log("error get count", error);
  }
};
