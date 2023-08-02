import { TableProps } from "@client/components/organisms/Table/@types/Table"
import { TableLoader } from "@client/components/organisms/Table/loader/TableLoader"

/**
 * A table component that displays rows of data. It can also display a loading state.
 */
export const Table: React.FC<TableProps> = ({
  className = "",
  headers,
  isLoading = false,
  loaderRows,
  rows = [],
}) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="table" role="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th className="align-middle" key={index}>
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {isLoading ? (
          <TableLoader columns={headers.length} rows={loaderRows} />
        ) : (
          rows?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td className="align-middle" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)
