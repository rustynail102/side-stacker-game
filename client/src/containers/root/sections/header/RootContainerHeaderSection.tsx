import { useSignOut } from "@client/api/mutations/useSignOut"
import { useGetCurrentPlayer } from "@client/api/queries/useGetCurrentPlayer"
import { Button } from "@client/components/atoms/Button/Button"
import {
  TypographyAlignment,
  TypographyVariant,
} from "@client/components/atoms/Typography/@types/Typography"
import { Typography } from "@client/components/atoms/Typography/Typography"
import { Dropdown } from "@client/components/molecules/Dropdown/Dropdown"
import { Header } from "@client/components/organisms/Header/Header"
import { useQueryClient } from "@tanstack/react-query"

export const RootContainerHeaderSection: React.FC = () => {
  const { currentPlayer } = useGetCurrentPlayer()
  const { isLoading: isSigningOut, signOut } = useSignOut()
  const queryClient = useQueryClient()

  const handleSignOut = () => {
    signOut({
      onSettled: async () => {
        await queryClient.resetQueries()
      },
    })
  }

  return (
    <Header>
      <Button>New Game</Button>
      <Dropdown
        items={[
          {
            isLoading: isSigningOut,
            onClick: handleSignOut,
            text: "Sign Out",
          },
        ]}
      >
        <Typography
          alignment={TypographyAlignment.Center}
          variant={TypographyVariant.Callout}
        >
          Hi, <strong>{currentPlayer?.username || "user"}</strong>
        </Typography>
      </Dropdown>
    </Header>
  )
}
