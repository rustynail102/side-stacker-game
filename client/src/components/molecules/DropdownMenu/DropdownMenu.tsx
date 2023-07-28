import { DropdownMenuProps } from "@client/components/molecules/DropdownMenu/@types/DropdownMenu"

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => (
  <ul tabIndex={0} className="menu w-full p-0 mt-2">
    {items.map(({ isLoading, text, onClick }, index) => (
      <li className={isLoading ? "disabled" : ""} key={`${index}-${text}`}>
        {isLoading ? (
          <span className="leading-5 px-4 py-2  !active:bg-transparent">
            {text}
            <span className="loading loading-spinner loading-xs" />
          </span>
        ) : (
          <a onClick={onClick}>{text}</a>
        )}
      </li>
    ))}
  </ul>
)
