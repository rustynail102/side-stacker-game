import { axios } from "@app/clients/axios"
import { RawAxiosRequestConfig } from "axios"

export const axiosGet = async <TResponse>(
  url: string,
  config?: RawAxiosRequestConfig,
): Promise<TResponse> => {
  const response = await axios.get<TResponse>(url, config)

  return response.data
}
