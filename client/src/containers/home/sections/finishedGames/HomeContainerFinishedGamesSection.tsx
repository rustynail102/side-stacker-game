import { useGetGames } from "@client/api/queries/useGetGames"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { GamesCards } from "@client/components/molecules/GamesCards/GamesCards"
import { Section } from "@client/components/molecules/Section/Section"
import { GameStateEnum } from "@server/@types/api"
import isEmpty from "lodash/isEmpty"
import { IconType } from "react-icons"
import { FiFrown } from "react-icons/fi"

export const HomeContainerFinishedGamesSection: React.FC = () => {
  const { games: finishedGames, isInitialLoading } = useGetGames({
    filters: {
      current_game_state: GameStateEnum.finished,
    },
    limit: 100,
  })

  return (
    <Section title="Finished Games">
      {!isEmpty(finishedGames) || isInitialLoading ? (
        <GamesCards games={finishedGames} isLoading={isInitialLoading} />
      ) : (
        <Alert icon={FiFrown as IconType} type={AlertType.Accent}>
          There are no Finished Games at the moment
        </Alert>
      )}
    </Section>
  )
}
