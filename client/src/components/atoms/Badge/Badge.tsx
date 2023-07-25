import {
  BadgeProps,
  BadgeType,
} from "@client/components/atoms/Badge/@types/Badge"

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  type = BadgeType.Default,
}) => <div className={`badge badge-md ${type} ${className}`}>{children}</div>
