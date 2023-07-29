import { TableProps } from "@client/components/organisms/Table/@types/Table"
import { TableLoader } from "@client/components/organisms/Table/loader/TableLoader"

export const Table: React.FC<TableProps> = ({
  className = "",
  headers,
  isLoading = false,
  loaderRows,
  rows = [],
}) => (
  <div className={`overflow-x-auto ${className}`}>
    <table className="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
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
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)
