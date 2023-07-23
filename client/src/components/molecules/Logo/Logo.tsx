import { Typography } from "@app/components/atoms/Typography/Typography"
import logo from "@app/assets/images/logo.svg"
import { Img } from "@app/components/atoms/Img/Img"
import { TypographyVariant } from "@app/components/atoms/Typography/@types/Typography"

export const Logo: React.FC = () => (
  <>
    <Img
      alt="Side-Stacker logo"
      className="w-28 h-28 mx-auto mb-4 animate-spin-y-8 drop-shadow-lg"
      src={logo}
    />
    <Typography variant={TypographyVariant.H1}>Side-Stacker</Typography>
  </>
)
