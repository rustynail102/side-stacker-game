import { websocketsClient } from "@client/clients/websocketsClient"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { InvalidateQueryPayload } from "@server/@types/websocketsServer"
import { useToast } from "@client/hooks/useToast"

/**
 * Hook that handles the setup of WebSockets connections and listeners.
 * It also handles the teardown when the component unmounts.
 */
export const useWebsockets = () => {
  const queryClient = useQueryClient()
  const { successToast } = useToast()

  useEffect(() => {
    websocketsClient.connect()

    const hasEventListener = (name: string) =>
      websocketsClient.listeners(name).length > 0

    if (!hasEventListener("invalidateQuery")) {
      websocketsClient.on(
        "invalidateQuery",
        async (data: InvalidateQueryPayload) => {
          const queryKey = [...data.entity, data.id].filter(Boolean)

          await queryClient.invalidateQueries({ queryKey, refetchType: "all" })
          await queryClient.refetchQueries({ queryKey, type: "all" })
        },
      )
    }

    if (!hasEventListener("toast")) {
      websocketsClient.on("toast", (message: string) => {
        successToast(message)
      })
    }

    return () => {
      websocketsClient.off("invalidateQuery")
      websocketsClient.off("toast")
      websocketsClient.close()
    }
  }, [queryClient, successToast])
}
