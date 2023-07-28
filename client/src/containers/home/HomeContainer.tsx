import { ColumnFlexBasis } from "@client/components/atoms/Column/@types/Column"
import { Column } from "@client/components/atoms/Column/Column"
import { PageTemplate } from "@client/components/templates/PageTemplate/PageTemplate"
import { HomeContainerPlayersSection } from "@client/containers/home/sections/players/HomeContainerPlayersSection"
import { HomeContainerFinishedGamesSection } from "@client/containers/home/sections/finishedGames/HomeContainerFinishedGamesSection"
import { HomeContainerGamesInProgressSection } from "@client/containers/home/sections/gamesInProgress/HomeContainerGamesInProgressSection"
import { HomeContainerOpenGamesSection } from "@client/containers/home/sections/openGames/HomeContainerOpenGamesSection"
import { HomeContainerStatsSection } from "@client/containers/home/sections/stats/HomeContainerStatsSection"

export const HomeContainer: React.FC = () => (
  <PageTemplate>
    <Column flexBasis={ColumnFlexBasis.Basis75}>
      <HomeContainerStatsSection />
      <HomeContainerOpenGamesSection />
      <HomeContainerGamesInProgressSection />
      <HomeContainerFinishedGamesSection />
    </Column>
    <Column flexBasis={ColumnFlexBasis.Basis25}>
      <HomeContainerPlayersSection />
    </Column>
  </PageTemplate>
)
