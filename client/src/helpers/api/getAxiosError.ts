import { AxiosError, AxiosResponse } from "axios"
import { ErrorResponse } from "@server/@types/api"

/**
 * Extracts the error data from an Axios error.
 * @param {unknown} error - The error to extract data from.
 * @returns {ErrorResponse} - The extracted error data.
 */
export const getAxiosError = (error: unknown) => {
  const _error = error as AxiosError
  const response = _error?.response as AxiosResponse<ErrorResponse>

  return response.data
}
