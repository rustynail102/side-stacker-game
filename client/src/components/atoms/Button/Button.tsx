import {
  ButtonProps,
  ButtonSize,
  ButtonFill,
  ButtonVariant,
} from "@app/components/atoms/Button/@types/Button"
import { mapButtonSizeToSpinnerSize } from "@app/components/atoms/Button/styles"

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  disabled,
  fill = ButtonFill.Full,
  isLoading,
  onClick,
  size = ButtonSize.Md,
  type,
  variant = ButtonVariant.Success,
}) => (
  <button
    disabled={disabled || isLoading}
    className={`btn ${size} ${fill} ${variant} ${className}`}
    onClick={onClick}
    type={type}
  >
    {isLoading ? (
      <span
        className={`loading loading-spinner ${mapButtonSizeToSpinnerSize[size]}`}
      ></span>
    ) : (
      children
    )}
  </button>
)
