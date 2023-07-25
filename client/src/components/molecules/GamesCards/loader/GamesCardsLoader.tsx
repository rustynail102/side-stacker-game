import { BadgeType } from "@client/components/atoms/Badge/@types/Badge"
import { Badge } from "@client/components/atoms/Badge/Badge"
import { Card } from "@client/components/molecules/Card/Card"

const commonClassNames = "animate-bg-gradient-slow bg-gradient-to-r bg-400%"

export const GamesCardsLoader: React.FC = () =>
  Array(4)
    .fill("")
    .map((_, index) => (
      <Card
        className="w-[calc(25%-12px)]"
        key={index}
        contentTop={
          <figure
            className={`bg-base-300 h-[152px] ${commonClassNames} from-primary to-secondary`}
          />
        }
      >
        <Badge
          className={`w-[120px] h-[28px] ${commonClassNames} from-base-300 to-neutral-content`}
          type={BadgeType.Default}
        >
          {" "}
        </Badge>
        <div className="flex items-center justify-start gap-2 flex-wrap mb-4">
          <Badge
            className={`w-[48px] ${commonClassNames} from-warning to-success`}
            type={BadgeType.Default}
          >
            {" "}
          </Badge>
          <Badge
            className={`w-[80px] ${commonClassNames} from-secondary to-primary`}
            type={BadgeType.Default}
          >
            {" "}
          </Badge>
          <Badge
            className={`w-[140px] ${commonClassNames} from-info to-success`}
            type={BadgeType.Info}
          >
            {" "}
          </Badge>
        </div>
      </Card>
    ))
