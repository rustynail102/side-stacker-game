import { ImgProps } from "@client/components/atoms/Img/@types/Img"

/**
 * An image component with customizable classes.
 */
export const Img: React.FC<ImgProps> = ({ alt, className = "", src }) => (
  <img src={src} className={`block ${className}`} alt={alt} />
)
