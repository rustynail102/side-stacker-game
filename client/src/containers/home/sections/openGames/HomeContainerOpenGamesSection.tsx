import { useGetGames } from "@client/api/queries/useGetGames"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { GamesCards } from "@client/components/molecules/GamesCards/GamesCards"
import { Pagination } from "@client/components/molecules/Pagination/Pagination"
import { Section } from "@client/components/molecules/Section/Section"
import { usePagination } from "@client/hooks/usePagination"
import { GameStateEnum } from "@server/@types/api"
import isEmpty from "lodash/isEmpty"
import { IconType } from "react-icons"
import { FiAlertCircle, FiFrown } from "react-icons/fi"

/**
 * Section component for the open games in the home page. It displays the open games and handles pagination.
 */
export const HomeContainerOpenGamesSection: React.FC = () => {
  const { limit, offset, setOffset } = usePagination()

  const {
    error,
    games: openGames,
    isInitialLoading,
    total,
  } = useGetGames(
    {
      filters: [
        {
          conditions: {
            current_game_state: GameStateEnum.waiting_for_players,
          },
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
    <Section title="Open Games">
      {!isEmpty(openGames) || isInitialLoading ? (
        <>
          <GamesCards games={openGames} isLoading={isInitialLoading} />

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
        <>
          {error ? (
            <Alert icon={FiAlertCircle as IconType} type={AlertType.Error}>
              It seems that there's a problem with the service. Please try again
              later.
            </Alert>
          ) : (
            <Alert icon={FiFrown as IconType} type={AlertType.Primary}>
              There are no Open Games at the moment
            </Alert>
          )}
        </>
      )}
    </Section>
  )
}
