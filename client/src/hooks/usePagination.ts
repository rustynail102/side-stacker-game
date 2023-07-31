import { useState } from "react"

/**
 * Hook that provides simple pagination functionality.
 * @param {Object} options - The options for the hook.
 * @param {number} options.limit - The initial limit for the pagination.
 * @returns {Object} - The current offset, the set function for the offset, and the limit.
 */
export const usePagination = (
  { limit } = {
    limit: 4,
  },
) => {
  const defaultLimit = limit
  const [offset, setOffset] = useState(0)

  return {
    limit: defaultLimit,
    offset,
    setOffset,
  }
}
