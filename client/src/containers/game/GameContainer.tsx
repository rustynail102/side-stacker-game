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
import { GameContainerNextMoveSection } from "@client/containers/game/sections/nextMove/GameContainerNextMoveSection"
import { GameContainerPlayersSection } from "@client/containers/game/sections/players/GameContainerPlayersSection"
import { IconType } from "react-icons"
import { FiAlertCircle } from "react-icons/fi"

export const GameContainer: React.FC = () => {
  const { game, isInitialLoading } = useGameContainerQueries()

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
            <GameContainerNextMoveSection />
          </Column>
        </>
      ) : (
        <Alert icon={FiAlertCircle as IconType} type={AlertType.Error}>
          Game Not Found
        </Alert>
      )}
    </PageTemplate>
  )
}
