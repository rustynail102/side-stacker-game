export interface DropdownMenuProps {
  items: {
    isLoading?: boolean
    text: string
    onClick: () => void
  }[]
}
