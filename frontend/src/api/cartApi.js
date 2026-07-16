import axios from "axios";
import { backendUrl } from "../App";

export const getCart = (userId) =>
  axios.get(`${backendUrl}/api/cart/${userId}`);

export const addToCart = (data) =>
  axios.post(`${backendUrl}/api/cart/add`, data);

export const updateCartItem = (data) =>
  axios.put(`${backendUrl}/api/cart/update`, data);

export const removeFromCart = (data) =>
  axios.delete(`${backendUrl}/api/cart/remove`, { data });

export const clearCart = (userId) =>
  axios.delete(`${backendUrl}/api/cart/clear`, {
    data: { userId },
  });