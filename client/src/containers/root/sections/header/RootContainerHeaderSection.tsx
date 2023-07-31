import { useCreateGame } from "@client/api/mutations/useCreateGame"
import { useSignOut } from "@client/api/mutations/useSignOut"
import { useGetCurrentPlayer } from "@client/api/queries/useGetCurrentPlayer"
import { queryKeys } from "@client/api/queryKeys"
import {
  ButtonFill,
  ButtonVariant,
} from "@client/components/atoms/Button/@types/Button"
import { Button } from "@client/components/atoms/Button/Button"
import {
  TypographyAlignment,
  TypographyVariant,
} from "@client/components/atoms/Typography/@types/Typography"
import { Typography } from "@client/components/atoms/Typography/Typography"
import { Dropdown } from "@client/components/molecules/Dropdown/Dropdown"
import { Header } from "@client/components/organisms/Header/Header"
import { gameRoute, homeRoute } from "@client/routing/routes"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/router"
import isEqual from "lodash/isEqual"
import { useCallback } from "react"

// Define text constants
const CREATE_GAME_ARIA_LABEL = "Create new game"
const NAVIGATE_GAME_LOBBY_ARIA_LABEL = "Navigate to game lobby"
const NEW_GAME_TEXT = "New Game"
const GAME_LOBBY_TEXT = "Game Lobby"
const SIGN_OUT_TEXT = "Sign Out"
const GREETING_TEXT = "Hi, "

/**
 * Component that displays the header section of the root container. It handles the logic for signing out and creating new games.
 * It uses the `useCreateGame` and `useSignOut` hooks for creating new games and signing out, respectively.
 */
export const RootContainerHeaderSection: React.FC = () => {
  const { currentPlayer } = useGetCurrentPlayer()
  const { isLoading: isSigningOut, signOut } = useSignOut()
  const queryClient = useQueryClient()

  const handleSignOut = () => {
    signOut(undefined, {
      onSettled: async () => {
        await queryClient.resetQueries({ queryKey: queryKeys.players.current })
        await queryClient.cancelQueries({
          predicate: (query) =>
            !isEqual(query.queryKey, queryKeys.players.current),
        })
      },
    })
  }

  const { createGame, isLoading: isCreatingGame } = useCreateGame()
  const navigate = useNavigate()

  const handleCreateGame = useCallback(() => {
    if (currentPlayer?.player_id) {
      createGame(
        {
          player1_id: currentPlayer.player_id,
        },
        {
          onSuccess: (game) => {
            queryClient.setQueriesData(
              queryKeys.games.detail(game.game_id),
              game,
            )

            void navigate({
              params: {
                game_id: game.game_id,
              },
              to: gameRoute.to,
            })
          },
        },
      )
    }
  }, [createGame, currentPlayer?.player_id, navigate, queryClient])

  const navigateToGameLobby = useCallback(() => {
    void navigate({
      to: homeRoute.to,
    })
  }, [navigate])

  return (
    <Header>
      <Button
        ariaLabel={CREATE_GAME_ARIA_LABEL}
        disabled={!currentPlayer?.player_id}
        isLoading={isCreatingGame}
        onClick={handleCreateGame}
      >
        {NEW_GAME_TEXT}
      </Button>
      <Button
        ariaLabel={NAVIGATE_GAME_LOBBY_ARIA_LABEL}
        fill={ButtonFill.Outline}
        isLoading={isCreatingGame}
        onClick={navigateToGameLobby}
        variant={ButtonVariant.Neutral}
      >
        {GAME_LOBBY_TEXT}
      </Button>
      <Dropdown
        items={[
          {
            isLoading: isSigningOut,
            onClick: handleSignOut,
            text: SIGN_OUT_TEXT,
          },
        ]}
      >
        <Typography
          alignment={TypographyAlignment.Center}
          variant={TypographyVariant.Callout}
        >
          {GREETING_TEXT} <strong>{currentPlayer?.username || "user"}</strong>
        </Typography>
      </Dropdown>
    </Header>
  )
}
