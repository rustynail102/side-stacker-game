import {
  FlexRowGap,
  FlexRowProps,
} from "@client/components/atoms/FlexRow/@types/FlexRow"

/**
 * A flexible row component for layout purposes.
 */
export const FlexRow: React.FC<FlexRowProps> = ({
  children,
  gap = FlexRowGap.Gap2,
}) => <div className={`flex items-center justify-start ${gap}`}>{children}</div>
