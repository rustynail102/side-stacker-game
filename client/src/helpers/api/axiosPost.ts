import { axios } from "@client/clients/axios"
import { RawAxiosRequestConfig } from "axios"

/**
 * Sends a POST request to a specified URL with provided data and returns the response data.
 * @param {string} url - The URL to send the POST request to.
 * @param {Record<string, unknown> | FormData} data - The data to send in the POST request.
 * @param {RawAxiosRequestConfig} config - Optional configuration for the request.
 * @returns {Promise<TResponse>} - A promise that resolves with the response data.
 */
export const axiosPost = async <TResponse>(
  url: string,
  data?: Record<string, unknown> | FormData,
  config?: RawAxiosRequestConfig,
): Promise<TResponse> => {
  const response = await axios.post<TResponse>(url, data, config)

  return response.data
}
