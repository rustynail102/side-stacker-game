import { useState } from "react"

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
