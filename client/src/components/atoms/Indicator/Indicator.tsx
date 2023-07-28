import { IndicatorProps } from "@client/components/atoms/Indicator/@types/Indicator"

export const Indicator: React.FC<IndicatorProps> = ({ type }) => (
  <div className={`w-2 h-2 rounded-full ${type}`} />
)
