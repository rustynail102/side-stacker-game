import { ColumnFlexBasis } from "@client/components/atoms/Column/@types/Column"
import { Column } from "@client/components/atoms/Column/Column"
import { DividerType } from "@client/components/atoms/Divider/@types/Divider"
import { Divider } from "@client/components/atoms/Divider/Divider"
import { Hero } from "@client/components/atoms/Hero/Hero"
import { Logo } from "@client/components/molecules/Logo/Logo"
import { AuthenticationTemplateProps } from "@client/components/templates/AuthenticationTemplate/@types/AuthenticationTemplate"
import { Fragment } from "react"

/**
 * A template component for authentication-related pages. It displays a logo and provides a layout for forms or other content.
 * The layout can be customized with props.
 */
export const AuthenticationTemplate: React.FC<AuthenticationTemplateProps> = ({
  children,
  dividerText = "OR",
  flexBasis = ColumnFlexBasis.Basis50,
}) => (
  <Hero>
    <Logo />
    <div className="flex mt-8 gap-4">
      {Array.isArray(children)
        ? children.map((child, index) => (
            <Fragment key={index}>
              {index !== 0 && (
                <Divider type={DividerType.Horizontal}>{dividerText}</Divider>
              )}
              <Column flexBasis={flexBasis}>{child}</Column>
            </Fragment>
          ))
        : children}
    </div>
  </Hero>
)
