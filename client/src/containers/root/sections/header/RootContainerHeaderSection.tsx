import { useCreateGame } from "@client/api/mutations/useCreateGame"
import { useSignOut } from "@client/api/mutations/useSignOut"
import { useGetCurrentPlayer } from "@client/api/queries/useGetCurrentPlayer"
import { queryKeys } from "@client/api/queryKeys"
import { Button } from "@client/components/atoms/Button/Button"
import {
  TypographyAlignment,
  TypographyVariant,
} from "@client/components/atoms/Typography/@types/Typography"
import { Typography } from "@client/components/atoms/Typography/Typography"
import { Dropdown } from "@client/components/molecules/Dropdown/Dropdown"
import { Header } from "@client/components/organisms/Header/Header"
import { gameRoute } from "@client/routing/routes"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/router"
import isEqual from "lodash/isEqual"

export const RootContainerHeaderSection: React.FC = () => {
  const { currentPlayer } = useGetCurrentPlayer()
  const { isLoading: isSigningOut, signOut } = useSignOut()
  const queryClient = useQueryClient()

  const handleSignOut = () => {
    signOut({
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

  const handleCreateGame = () => {
    if (currentPlayer?.player_id) {
      createGame(
        {
          player1_id: currentPlayer.player_id,
        },
        {
          onSuccess: async (game) => {
            queryClient.setQueriesData(
              queryKeys.games.detail(game.game_id),
              game,
            )

            await navigate({
              params: {
                game_id: game.game_id,
              },
              to: gameRoute.to,
            })
          },
        },
      )
    }
  }

  return (
    <Header>
      <Button
        disabled={!currentPlayer?.player_id}
        isLoading={isCreatingGame}
        onClick={handleCreateGame}
      >
        New Game
      </Button>
      <Dropdown
        items={[
          {
            isLoading: isSigningOut,
            onClick: handleSignOut,
            text: "Sign Out",
          },
        ]}
      >
        <Typography
          alignment={TypographyAlignment.Center}
          variant={TypographyVariant.Callout}
        >
          Hi, <strong>{currentPlayer?.username || "user"}</strong>
        </Typography>
      </Dropdown>
    </Header>
  )
}
