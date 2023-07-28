import { useGetCurrentPlayer } from "@client/api/queries/useGetCurrentPlayer"
import { useGetPlayers } from "@client/api/queries/useGetPlayers"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { Card } from "@client/components/molecules/Card/Card"
import { Table } from "@client/components/organisms/Table/Table"
import { mapPlayersToRows } from "@client/containers/home/sections/players/helpers/mapPlayersToRows"
import isEmpty from "lodash/isEmpty"
import { IconType } from "react-icons"
import { FiUserX } from "react-icons/fi"

export const HomeContainerPlayersSection: React.FC = () => {
  const { isInitialLoading, players } = useGetPlayers({
    limit: 100,
  })

  const { currentPlayer } = useGetCurrentPlayer()
  const rows = mapPlayersToRows(currentPlayer?.player_id, players)

  return (
    <Card title="Players">
      {isInitialLoading || !isEmpty(rows) ? (
        <Table
          headers={[" ", "Name", "Last Active"]}
          isLoading={isInitialLoading}
          rows={rows}
        />
      ) : (
        <Alert icon={FiUserX as IconType} type={AlertType.Accent}>
          There are no active players
        </Alert>
      )}
    </Card>
  )
}
