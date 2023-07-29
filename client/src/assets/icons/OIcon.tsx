export const OIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className,
  ...props
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 701 701"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M350.479 610.341c143.595 0 260-116.406 260-260s-116.405-259.9999-260-259.9999c-143.594 0-259.9995 116.4059-259.9995 259.9999 0 143.594 116.4055 260 259.9995 260Zm0 90c193.3 0 350-156.7 350-350s-156.7-350-350-350C157.18.341.4795 157.041.4795 350.341s156.7005 350 349.9995 350Z"
      clipRule="evenodd"
    />
  </svg>
)
