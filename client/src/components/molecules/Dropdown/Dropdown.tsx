import {
  ButtonFill,
  ButtonShape,
  ButtonVariant,
} from "@client/components/atoms/Button/@types/Button"
import { Button } from "@client/components/atoms/Button/Button"
import { Card } from "@client/components/molecules/Card/Card"
import { DropdownProps } from "@client/components/molecules/Dropdown/@types/Dropdown"
import { DropdownMenu } from "@client/components/molecules/DropdownMenu/DropdownMenu"
import { useRef, useState } from "react"
import { FiMenu, FiX } from "react-icons/fi"
import { useOnClickOutside } from "usehooks-ts"

/**
 * A dropdown component that displays a list of items when clicked.
 */
export const Dropdown: React.FC<DropdownProps> = ({ children, items }) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const closeDropdown = () => setIsOpen(false)

  useOnClickOutside(ref, closeDropdown)

  const swapActiveClassName = isOpen ? "swap-active" : ""

  return (
    <div className="relative z-[100]" ref={ref}>
      <Button
        ariaLabel="Open and close dropdown"
        className={`swap swap-rotate ${swapActiveClassName}`}
        fill={ButtonFill.Outline}
        shape={ButtonShape.Circle}
        onClick={() => setIsOpen((_isOpen) => !_isOpen)}
        variant={ButtonVariant.Neutral}
      >
        <FiMenu className="swap-off fill-current w-8 h-8" />

        <FiX className="swap-on fill-current w-8 h-8" />
      </Button>

      {isOpen && (
        <Card className="z-[1] w-52 absolute top-14 right-0">
          {children}

          <DropdownMenu items={items} />
        </Card>
      )}
    </div>
  )
}
