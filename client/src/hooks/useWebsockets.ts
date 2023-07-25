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

    websocketsClient.on(
      "invalidateQuery",
      async (data: InvalidateQueryPayload) => {
        console.log("invalidateQuery event", { data })
        const queryKey = [...data.entity, data.id].filter(Boolean)

        await queryClient.invalidateQueries({ queryKey })
      },
    )

    websocketsClient.on("toast", (message: string) => {
      console.log("toast event", { message })

      successToast(message)
    })

    return () => {
      websocketsClient.close()
    }
  }, [queryClient, successToast])
}
