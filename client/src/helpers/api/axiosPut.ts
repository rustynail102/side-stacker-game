import { axios } from "@client/clients/axios"
import { RawAxiosRequestConfig } from "axios"

const axiosPut = async <TResponse>(
  url: string,
  data?: Record<string, unknown>,
  config?: RawAxiosRequestConfig,
): Promise<TResponse> => {
  const response = await axios.put<TResponse>(url, data, config)

  return response.data
}

export { axiosPut }
