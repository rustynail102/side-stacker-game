import { PlayerResponse } from "@server/@types/api"
import { useLocalStorage } from "usehooks-ts"

export const useAuthenticatedUser = () => {
  const [authenticatedUser, setAuthenticatedUser] = useLocalStorage<
    PlayerResponse | undefined
  >("user", undefined)

  return {
    authenticatedUser,
    setAuthenticatedUser,
  }
}
