import { useGetGames } from "@client/api/queries/useGetGames"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { GamesCards } from "@client/components/molecules/GamesCards/GamesCards"
import { Section } from "@client/components/molecules/Section/Section"
import { GameStateEnum } from "@server/@types/api"
import isEmpty from "lodash/isEmpty"
import { IconType } from "react-icons"
import { FiFrown } from "react-icons/fi"

export const HomeContainerGamesInProgressSection: React.FC = () => {
  const { games: gamesInProgress, isInitialLoading } = useGetGames({
    filters: {
      current_game_state: GameStateEnum.in_progress,
    },
    limit: 100,
  })

  return (
    <Section title="Games In Progress">
      {!isEmpty(gamesInProgress) || isInitialLoading ? (
        <GamesCards games={gamesInProgress} isLoading={isInitialLoading} />
      ) : (
        <Alert icon={FiFrown as IconType} type={AlertType.Secondary}>
          There are no Games In Progress at the moment
        </Alert>
      )}
    </Section>
  )
}
