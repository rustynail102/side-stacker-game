import {
  DividerProps,
  DividerType,
} from "@client/components/atoms/Divider/@types/Divider"

/**
 * A divider component which can be vertical or horizontal.
 */
export const Divider: React.FC<DividerProps> = ({
  children,
  type = DividerType.Vertical,
}) => (
  <div
    className={`
        divider 
        ${type === DividerType.Horizontal ? "divider-horizontal" : ""}
    `}
  >
    {children}
  </div>
)
