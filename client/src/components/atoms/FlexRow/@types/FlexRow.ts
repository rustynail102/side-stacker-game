import { ReactNode } from "react"

export enum FlexRowGap {
  Gap2 = "gap-2",
  Gap4 = "gap-4",
  Gap8 = "gap-8",
}

export interface FlexRowProps {
  children: ReactNode | ReactNode[]
  gap?: FlexRowGap
}
