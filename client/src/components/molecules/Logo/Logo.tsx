import { Typography } from "@client/components/atoms/Typography/Typography"
import logo from "@client/assets/images/logo.svg"
import { Img } from "@client/components/atoms/Img/Img"
import {
  TypographyAlignment,
  TypographyVariant,
} from "@client/components/atoms/Typography/@types/Typography"
import {
  LogoProps,
  LogoSize,
} from "@client/components/molecules/Logo/@types/Logo"

export const Logo: React.FC<LogoProps> = ({
  className,
  size = LogoSize.Lg,
}) => {
  switch (size) {
    case LogoSize.Sm:
      return (
        <div className="flex items-center gap-2 group">
          <Img
            alt="Side-Stacker logo"
            className={`w-12 h-12 drop-shadow-md ${className?.img || ""}`}
            src={logo}
          />
          <Typography variant={TypographyVariant.Subtitle}>
            Side-Stacker
          </Typography>
        </div>
      )

    case LogoSize.Lg:
      return (
        <div className="flex flex-col items-center gap-2 ">
          <Img
            alt="Side-Stacker logo"
            className={`
              w-28 h-28 mx-auto mb-4 
              animate-spin-y-8 drop-shadow-lg 
              ${className?.img || ""}
            `}
            src={logo}
          />
          <Typography
            variant={TypographyVariant.Title}
            alignment={TypographyAlignment.Center}
          >
            Side-Stacker
          </Typography>
        </div>
      )
  }
}
