import {
  AlertProps,
  AlertType,
} from "@client/components/molecules/Alert/@types/Alert"
import { mapAlertTypeToStyles } from "@client/components/molecules/Alert/styles"

/**
 * An alert component that displays a message with an optional icon.
 */
export const Alert: React.FC<AlertProps> = ({
  children,
  icon: Icon,
  type = AlertType.Default,
}) => (
  <div className={`alert ${mapAlertTypeToStyles[type].container}`}>
    {Icon && (
      <Icon className={`${mapAlertTypeToStyles[type].icon} shrink-0 w-6 h-6`} />
    )}
    <span className="text-sm">{children}</span>
  </div>
)
