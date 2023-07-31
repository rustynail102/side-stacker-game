import { HeaderProps } from "@client/components/organisms/Header/@types/Header"
import { LogoSize } from "@client/components/molecules/Logo/@types/Logo"
import { Logo } from "@client/components/molecules/Logo/Logo"
import { homeRoute } from "@client/routing/routes"
import { Link } from "@tanstack/router"

/**
 * The header component of the application. It contains a logo and space for additional children components.
 */
export const Header: React.FC<HeaderProps> = ({ children }) => (
  <header className="bg-base-300 sticky top-0 left-0 right-0 w-full shadow-md z-[100] h-20">
    <div className="max-w-7xl p-4 mx-auto flex gap-4 items-center justify-between">
      <Link to={homeRoute.to}>
        <Logo
          className={{
            img: "group-hover:-animate-bounce-and-spin-y-2",
          }}
          size={LogoSize.Sm}
        />
      </Link>

      <div className="flex items-center gap-2">{children}</div>
    </div>
  </header>
)
