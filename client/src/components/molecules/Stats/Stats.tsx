import { Stat } from "@client/components/atoms/Stat/Stat"
import { StatsProps } from "@client/components/molecules/Stats/@types/Stats"

export const Stats: React.FC<StatsProps> = ({ className = "", stats }) => (
  <div className={`stats shadow w-full bg-base ${className}`}>
    {stats.map((stat, index) => (
      <Stat {...stat} key={`${stat.title}-${index}`} />
    ))}
  </div>
)
