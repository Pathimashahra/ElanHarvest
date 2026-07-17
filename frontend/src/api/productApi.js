import axios from "axios";

const BASE_URL = "/api/products";

export const getProducts = () => axios.get(BASE_URL);

export const addProduct = (formData) =>
  axios.post(BASE_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteProduct = (id) =>
  axios.delete(`${BASE_URL}/${id}`);

export const updateProduct = (id, formData) =>
  axios.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });