import {
  ColumnFlexBasis,
  ColumnGap,
} from "@client/components/atoms/Column/@types/Column"
import { Column } from "@client/components/atoms/Column/Column"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { PageTemplate } from "@client/components/templates/PageTemplate/PageTemplate"
import { useGameContainerQueries } from "@client/containers/game/hooks/useGameContainerQueries"
import { GameContainerBoardSection } from "@client/containers/game/sections/board/GameContainerBoardSection"
import { GameContainerInfoSection } from "@client/containers/game/sections/info/GameContainerInfoSection"
import { GameContainerStatusSection } from "@client/containers/game/sections/status/GameContainerStatusSection"
import { GameContainerPlayersSection } from "@client/containers/game/sections/players/GameContainerPlayersSection"
import { IconType } from "react-icons"
import { FiAlertCircle } from "react-icons/fi"

/**
 * Container component for the game page. It includes sections for game board, game info, game players, and game status.
 */
export const GameContainer: React.FC = () => {
  const { game, hasError, isInitialLoading } = useGameContainerQueries()

  return (
    <PageTemplate>
      {game || isInitialLoading ? (
        <>
          <Column flexBasis={ColumnFlexBasis.Basis75}>
            <GameContainerBoardSection />
          </Column>
          <Column flexBasis={ColumnFlexBasis.Basis25} gap={ColumnGap.Gap4}>
            <GameContainerInfoSection />
            <GameContainerPlayersSection />
            <GameContainerStatusSection />
          </Column>
        </>
      ) : (
        <Alert icon={FiAlertCircle as IconType} type={AlertType.Error}>
          {hasError
            ? "It seems that there's a problem with the service. Please try again later."
            : "Game Not Found"}
        </Alert>
      )}
    </PageTemplate>
  )
}
