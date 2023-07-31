import { axios } from "@client/clients/axios"
import { RawAxiosRequestConfig } from "axios"

/**
 * Sends a GET request to a specified URL and returns the response data.
 * @param {string} url - The URL to send the GET request to.
 * @param {RawAxiosRequestConfig} config - Optional configuration for the request.
 * @returns {Promise<TResponse>} - A promise that resolves with the response data.
 */
export const axiosGet = async <TResponse>(
  url: string,
  config?: RawAxiosRequestConfig,
): Promise<TResponse> => {
  const response = await axios.get<TResponse>(url, config)

  return response.data
}
