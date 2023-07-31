import { useGetCurrentPlayer } from "@client/api/queries/useGetCurrentPlayer"
import { FullScreenLoader } from "@client/components/atoms/FullScreenLoader/FullScreenLoader"
import { AuthenticationContainer } from "@client/containers/authentication/AuthenticationContainer"
import { RootContainerHeaderSection } from "@client/containers/root/sections/header/RootContainerHeaderSection"
import { useWebsockets } from "@client/hooks/useWebsockets"
import { Outlet } from "@tanstack/router"

/**
 * Container component for the root of the application. It manages authentication and routing for the application.
 * It uses the `useWebsockets` hook to establish a WebSocket connection, the `useGetCurrentPlayer` hook to get the current player,
 * and the `Outlet` component from `@tanstack/router` to render child routes.
 */
export const RootContainer: React.FC = () => {
  useWebsockets()

  const { currentPlayer, isInitialLoading } = useGetCurrentPlayer()

  if (isInitialLoading) {
    return <FullScreenLoader />
  }

  if (!currentPlayer) {
    return <AuthenticationContainer />
  }

  return (
    <div>
      <RootContainerHeaderSection />
      <Outlet /> {/* This is where child routes will render */}
    </div>
  )
}
