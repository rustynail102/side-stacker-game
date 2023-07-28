import {
  ColumnFlexBasis,
  ColumnFlexGrow,
  ColumnProps,
} from "@client/components/atoms/Column/@types/Column"

export const Column: React.FC<ColumnProps> = ({
  children,
  className = "",
  flexBasis = ColumnFlexBasis.Basis0,
  flexGrow = ColumnFlexGrow.Grow0,
}) => <div className={`${flexBasis} ${flexGrow} ${className}`}>{children}</div>
