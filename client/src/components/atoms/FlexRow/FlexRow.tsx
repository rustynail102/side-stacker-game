import {
  FlexRowGap,
  FlexRowProps,
} from "@client/components/atoms/FlexRow/@types/FlexRow"

export const FlexRow: React.FC<FlexRowProps> = ({
  children,
  gap = FlexRowGap.Gap2,
}) => <div className={`flex items-center justify-start ${gap}`}>{children}</div>
