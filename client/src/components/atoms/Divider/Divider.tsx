import {
  DividerProps,
  DividerType,
} from "@client/components/atoms/Divider/@types/Divider"
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
