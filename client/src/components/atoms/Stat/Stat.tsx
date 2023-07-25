import { BadgeType } from "@client/components/atoms/Badge/@types/Badge"
import { Badge } from "@client/components/atoms/Badge/Badge"
import {
  StatProps,
  StatVariant,
} from "@client/components/atoms/Stat/@types/Stat"
import { mapStatVariantToLoaderStyles } from "@client/components/atoms/Stat/styles"

export const Stat: React.FC<StatProps> = ({
  icon,
  isLoading,
  title,
  value,
  variant = StatVariant.Primary,
}) => {
  const Icon = icon

  return (
    <div className="stat bg-white">
      <div className={`stat-figure ${variant}`}>
        <Icon className="inline-block w-8 h-8 stroke-current" />
      </div>
      <div className="stat-title">{title}</div>
      <div className={`stat-value ${variant}`}>
        {isLoading ? (
          <Badge
            className={`w-[60px] h-[28px] animate-bg-gradient-slow bg-gradient-to-r bg-400% ${mapStatVariantToLoaderStyles[variant]}`}
            type={BadgeType.Default}
          >
            {" "}
          </Badge>
        ) : (
          value
        )}
      </div>
    </div>
  )
}
