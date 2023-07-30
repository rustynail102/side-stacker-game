import { useGetCurrentPlayer } from "@client/api/queries/useGetCurrentPlayer"
import { useGetGames } from "@client/api/queries/useGetGames"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { GamesCards } from "@client/components/molecules/GamesCards/GamesCards"
import { Pagination } from "@client/components/molecules/Pagination/Pagination"
import { Section } from "@client/components/molecules/Section/Section"
import { usePagination } from "@client/hooks/usePagination"
import { FilterType, GameStateEnum } from "@server/@types/api"
import isEmpty from "lodash/isEmpty"
import { IconType } from "react-icons"
import { FiFrown } from "react-icons/fi"

export const HomeContainerCurrentPlayerGamesSection: React.FC = () => {
  const { currentPlayer } = useGetCurrentPlayer()

  const { limit, offset, setOffset } = usePagination()

  const {
    games: currentPlayerGames,
    isInitialLoading,
    total,
  } = useGetGames(
    {
      filters: [
        {
          conditions: {
            current_game_state: GameStateEnum.in_progress,
            player1_id: currentPlayer?.player_id,
          },
          filterType: FilterType.AND,
        },
        {
          conditions: {
            current_game_state: GameStateEnum.waiting_for_players,
            player1_id: currentPlayer?.player_id,
          },
          filterType: FilterType.AND,
        },
        {
          conditions: {
            current_game_state: GameStateEnum.in_progress,
            player2_id: currentPlayer?.player_id,
          },
          filterType: FilterType.AND,
        },
        {
          conditions: {
            current_game_state: GameStateEnum.waiting_for_players,
            player2_id: currentPlayer?.player_id,
          },
          filterType: FilterType.AND,
        },
      ],
      limit,
      offset,
    },
    {
      keepPreviousData: true,
    },
  )

  return (
    <Section title="Your Games">
      {!isEmpty(currentPlayerGames) || isInitialLoading ? (
        <>
          <GamesCards games={currentPlayerGames} isLoading={isInitialLoading} />

          {total && total > limit && (
            <Pagination
              limit={limit}
              offset={offset}
              onNextPage={() => setOffset((_offset) => _offset + limit)}
              onPreviousPage={() => setOffset((_offset) => _offset - limit)}
              total={total}
            />
          )}
        </>
      ) : (
        <Alert icon={FiFrown as IconType} type={AlertType.Secondary}>
          You are not participating in any Game
        </Alert>
      )}
    </Section>
  )
}
