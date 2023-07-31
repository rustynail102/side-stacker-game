import { config } from "@client/config"
import _axios from "axios"

/**
 * Axios instance with predefined configuration.
 * @property {string} baseURL - The base URL for the API endpoints.
 * @property {boolean} withCredentials - Tells Axios to send cookies from the origin.
 */
export const axios = _axios.create({
  baseURL: config.api.httpBaseUrl,
  withCredentials: true,
})
