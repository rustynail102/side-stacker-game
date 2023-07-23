import { AxiosError, AxiosResponse } from "axios"
import { ErrorResponse } from "@server/@types/api"

const getAxiosError = (error: unknown) => {
  const _error = error as AxiosError
  const response = _error?.response as AxiosResponse<ErrorResponse>

  return response.data
}

export { getAxiosError }
