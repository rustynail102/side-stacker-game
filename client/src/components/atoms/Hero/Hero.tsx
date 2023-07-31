import { HeroProps } from "@client/components/atoms/Hero/@types/Hero"

/**
 * A hero component with a white background and centered content.
 */
export const Hero: React.FC<HeroProps> = ({ children, className = "" }) => (
  <div className={`hero min-h-screen bg-base-200 ${className}`}>
    <div className="hero-content text-center bg-base-100 rounded-xl shadow-md w-full max-w-[600px]">
      <div className="w-full">{children}</div>
    </div>
  </div>
)
