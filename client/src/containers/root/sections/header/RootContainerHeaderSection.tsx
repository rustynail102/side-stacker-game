import { Button } from "@client/components/atoms/Button/Button"
import {
  TypographyAlignment,
  TypographyVariant,
} from "@client/components/atoms/Typography/@types/Typography"
import { Typography } from "@client/components/atoms/Typography/Typography"
import { Dropdown } from "@client/components/molecules/Dropdown/Dropdown"
import { Header } from "@client/components/organisms/Header/Header"
import { useAuthenticatedUser } from "@client/hooks/useAuthenticatedUser"

export const RootContainerHeaderSection: React.FC = () => {
  const { authenticatedUser } = useAuthenticatedUser()

  return (
    <Header>
      <Button>New Game</Button>
      <Dropdown
        items={[
          {
            onClick: () => false,
            text: "Quit Application",
          },
        ]}
      >
        <Typography
          alignment={TypographyAlignment.Center}
          variant={TypographyVariant.Callout}
        >
          Hi, <strong>{authenticatedUser?.username}</strong>
        </Typography>
      </Dropdown>
    </Header>
  )
}
