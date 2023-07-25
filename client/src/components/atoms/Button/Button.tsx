import {
  ButtonProps,
  ButtonSize,
  ButtonFill,
  ButtonVariant,
  ButtonShape,
} from "@client/components/atoms/Button/@types/Button"
import { mapButtonSizeToSpinnerSize } from "@client/components/atoms/Button/styles"

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  disabled,
  fill = ButtonFill.Full,
  isLoading,
  onClick,
  shape = ButtonShape.Default,
  size = ButtonSize.Md,
  type,
  variant = ButtonVariant.Success,
}) => (
  <button
    disabled={disabled || isLoading}
    className={`btn ${size} ${shape} ${fill} ${variant} ${className}`}
    onClick={onClick}
    type={type}
  >
    {isLoading ? (
      <>
        <span
          className={`loading loading-spinner ${mapButtonSizeToSpinnerSize[size]}`}
        ></span>
        Loading..
      </>
    ) : (
      children
    )}
  </button>
)
