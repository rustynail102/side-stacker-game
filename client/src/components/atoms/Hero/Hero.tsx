import { HeroProps } from "@client/components/atoms/Hero/@types/Hero"

export const Hero: React.FC<HeroProps> = ({ children, className = "" }) => (
  <div className={`hero min-h-screen bg-base-200 ${className}`}>
    <div className="hero-content text-center bg-base-100 rounded-xl shadow-md">
      <div className="max-w-md">{children}</div>
    </div>
  </div>
)
