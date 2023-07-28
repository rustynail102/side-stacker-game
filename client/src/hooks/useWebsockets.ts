import { websocketsClient } from "@client/clients/websocketsClient"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { InvalidateQueryPayload } from "@server/@types/websocketsServer"
import { useToast } from "@client/hooks/useToast"

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
          console.log("invalidateQuery event", { data })
          const queryKey = [...data.entity, data.id].filter(Boolean)

          await queryClient.invalidateQueries({ queryKey })
        },
      )
    }

    if (!hasEventListener("toast")) {
      websocketsClient.on("toast", (message: string) => {
        console.log("toast event", { message })

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
