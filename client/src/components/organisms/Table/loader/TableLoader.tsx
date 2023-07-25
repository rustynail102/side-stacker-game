import { TableLoaderProps } from "@client/components/organisms/Table/@types/Table"

export const TableLoader: React.FC<TableLoaderProps> = ({
  columns,
  rows = 6,
}) =>
  Array(rows)
    .fill("")
    .map((_, index) => (
      <tr key={index}>
        <th
          className={
            index % 2 !== 0
              ? "animate-bg-gradient-slow bg-gradient-to-r from-primary to-secondary bg-400%"
              : ""
          }
          colSpan={columns}
        />
      </tr>
    ))
