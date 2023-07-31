import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { axiosGet } from "@client/helpers/api/axiosGet"
import { RawAxiosRequestConfig } from "axios"

/**
 * Custom hook to make API query requests with React Query and Axios.
 * @param {string} path - The API path to make the request to.
 * @param {Array} queryKey - The query key to use for this query. queryKeys are defined at `@client/api/queryKeys`
 * @param {Object} options - Additional options to pass to the React Query useQuery function.
 * @param {Object} config - Additional options to pass to the React Query useQuery function.
 * @returns {Object} - The query object from React Query.
 */
export const useApiQuery = <ResponseBody, Error = unknown>(
  path: string,
  queryKey: QueryKey,
  options?: UseQueryOptions<ResponseBody, Error, ResponseBody>,
  config?: RawAxiosRequestConfig,
) => {
  const apiQuery = useQuery({
    queryFn: () => axiosGet<ResponseBody>(path, config),
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    ...options,
  })

  const data = apiQuery.data

  return {
    ...apiQuery,
    data,
  }
}
