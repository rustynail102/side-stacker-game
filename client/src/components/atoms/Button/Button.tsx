import {
  ButtonProps,
  ButtonSize,
  ButtonFill,
  ButtonVariant,
  ButtonShape,
} from "@client/components/atoms/Button/@types/Button"
import { mapButtonSizeToSpinnerSize } from "@client/components/atoms/Button/styles"

/**
 * A customizable button component.
 */
export const Button: React.FC<ButtonProps> = ({
  ariaLabel,
  children,
  className = "",
  dataTestId,
  disabled,
  fill = ButtonFill.Full,
  isLoading,
  name,
  onClick,
  shape = ButtonShape.Default,
  size = ButtonSize.Md,
  type,
  variant = ButtonVariant.Success,
}) => (
  <button
    aria-label={ariaLabel}
    data-testid={dataTestId}
    disabled={disabled || isLoading}
    className={`btn 
      ${size} ${shape} ${fill} ${disabled ? "btn-disabled" : variant}
      ${className}
    `}
    name={name || String(children)}
    onClick={onClick}
    type={type}
  >
    {isLoading ? (
      <>
        <span
          className={`loading loading-spinner ${mapButtonSizeToSpinnerSize[size]}`}
        />
        Loading..
      </>
    ) : (
      children
    )}
  </button>
)
