import { IndicatorProps } from "@client/components/atoms/Indicator/@types/Indicator"

/**
 * A simple indicator component. It can represent different states based on its color.
 */
export const Indicator: React.FC<IndicatorProps> = ({ type }) => (
  <div className={`w-2 h-2 rounded-full ${type}`} />
)
