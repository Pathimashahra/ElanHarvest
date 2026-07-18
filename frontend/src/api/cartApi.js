import axios from "axios";

const BASE_URL = "/api/cart";

export const getCart = (userId) =>
  axios.get(`${BASE_URL}/${userId}`);

export const addToCart = (data) =>
  axios.post(`${BASE_URL}/add`, data);

export const updateCartItem = (data) =>
  axios.put(`${BASE_URL}/update`, data);

export const removeFromCart = (data) =>
  axios.delete(`${BASE_URL}/remove`, { data });

export const clearCart = (userId) =>
  axios.delete(`${BASE_URL}/clear`, {
    data: { userId },
  });