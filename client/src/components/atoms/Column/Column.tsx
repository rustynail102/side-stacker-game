import {
  ColumnProps,
  ColumnType,
} from "@client/components/atoms/Column/@types/Column"

export const Column: React.FC<ColumnProps> = ({
  children,
  className = "",
  type = ColumnType.Default,
}) => <div className={`${type} ${className}`}>{children}</div>
