import { axios } from "@app/clients/axios"
import { RawAxiosRequestConfig } from "axios"

export const axiosPost = async <TResponse>(
  url: string,
  data?: Record<string, unknown> | FormData,
  config?: RawAxiosRequestConfig,
): Promise<TResponse> => {
  const response = await axios.post<TResponse>(url, data, config)

  return response.data
}
