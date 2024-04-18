import axios, { AxiosResponse } from "axios";
import { TProduct } from "../utils/types";

const baseURL = `https://fakestoreapi.com`;

const api = axios.create({
  baseURL,
});

export const fetchProducts = (
  limit?: number
): Promise<AxiosResponse<TProduct[]>> =>
  api.get("/products", { params: { limit } });

export const fetchProductDetails = (
  id: number
): Promise<AxiosResponse<TProduct>> => api.get(`/products/${id}`);
