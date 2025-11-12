'use client';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  theme?: 'light' | 'dark';
  onRowClick?: (row: any) => void;
}

export default function DataTable({ columns, data, theme = 'dark', onRowClick }: DataTableProps) {
  const bgColor = theme === 'dark' ? 'bg-[#1A1A1A]' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-[#2A2A2A]' : 'border-gray-200';
  const hoverColor = theme === 'dark' ? 'hover:bg-[#1F1F1F]' : 'hover:bg-gray-50';

  return (
    <div className={`${bgColor} rounded-xl border ${borderColor} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${theme === 'dark' ? 'bg-[#0F0F0F]' : 'bg-gray-50'}`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-sm font-semibold ${mutedColor} uppercase tracking-wider`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2A2A2A]">
            {data.map((row, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(row)}
                className={`${hoverColor} transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((column) => (
                  <td key={column.key} className={`px-6 py-4 text-sm ${textColor}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className={`text-center py-12 ${mutedColor}`}>
          <p>Nenhum dado encontrado</p>
        </div>
      )}
    </div>
  );
}
