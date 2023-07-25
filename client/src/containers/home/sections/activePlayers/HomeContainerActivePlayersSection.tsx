import { useGetPlayers } from "@client/api/queries/useGetPlayers"
import { AlertType } from "@client/components/molecules/Alert/@types/Alert"
import { Alert } from "@client/components/molecules/Alert/Alert"
import { Card } from "@client/components/molecules/Card/Card"
import { Table } from "@client/components/organisms/Table/Table"
import { mapPlayersToRows } from "@client/containers/home/sections/activePlayers/helpers/mapPlayersToRows"
import { useAuthenticatedUser } from "@client/hooks/useAuthenticatedUser"
import isEmpty from "lodash/isEmpty"
import { IconType } from "react-icons"
import { FiUserX } from "react-icons/fi"

export const HomeContainerActivePlayersSection: React.FC = () => {
  const { isInitialLoading, players } = useGetPlayers({
    limit: 100,
  })

  const { authenticatedUser } = useAuthenticatedUser()
  const rows = mapPlayersToRows(authenticatedUser?.player_id, players)

  return (
    <Card className="min-w-[320px]" title="Active Players">
      {isInitialLoading || !isEmpty(rows) ? (
        <Table
          headers={["#", "Name", "Last Active"]}
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
