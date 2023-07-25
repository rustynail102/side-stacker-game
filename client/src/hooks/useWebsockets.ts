import { websocketsClient } from "@client/clients/websocketsClient"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { InvalidateQueryPayload } from "@server/@types/websocketsServer"

export const useWebsockets = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    websocketsClient.connect()

    websocketsClient.on(
      "invalidateQuery",
      async (data: InvalidateQueryPayload) => {
        console.log("invalidateQuery", { data })
        const queryKey = [...data.entity, data.id].filter(Boolean)

        await queryClient.invalidateQueries({ queryKey })
      },
    )

    return () => {
      websocketsClient.close()
    }
  }, [queryClient])
}
