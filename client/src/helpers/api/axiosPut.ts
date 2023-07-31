import { axios } from "@client/clients/axios"
import { RawAxiosRequestConfig } from "axios"

/**
 * Sends a PUT request to a specified URL with provided data and returns the response data.
 * @param {string} url - The URL to send the PUT request to.
 * @param {Record<string, unknown>} data - The data to send in the PUT request.
 * @param {RawAxiosRequestConfig} config - Optional configuration for the request.
 * @returns {Promise<TResponse>} - A promise that resolves with the response data.
 */
export const axiosPut = async <TResponse>(
  url: string,
  data?: Record<string, unknown>,
  config?: RawAxiosRequestConfig,
): Promise<TResponse> => {
  const response = await axios.put<TResponse>(url, data, config)

  return response.data
}
