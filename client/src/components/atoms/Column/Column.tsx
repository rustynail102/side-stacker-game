import {
  ColumnFlexBasis,
  ColumnFlexGrow,
  ColumnProps,
} from "@client/components/atoms/Column/@types/Column"

/**
 * A flexible column component for layout purposes.
 */
export const Column: React.FC<ColumnProps> = ({
  children,
  className = "",
  flexBasis = ColumnFlexBasis.Basis0,
  flexGrow = ColumnFlexGrow.Grow0,
  gap,
}) => (
  <div
    className={`
      ${flexBasis} ${flexGrow} ${className} 
      ${gap ? `flex flex-col ${gap}` : ""}
    `}
  >
    {children}
  </div>
)
