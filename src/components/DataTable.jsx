import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export function DataTable({ data, columns, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        <span className="ml-3 text-white/70">Loading data...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((column, index) => (
              <th key={index} className="text-left py-4 px-4 text-white/70 font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row border-b border-white/5 hover:bg-white/5">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="py-4 px-4">
                  {column.cell ? column.cell({ row: { original: row } }) : row[column.accessorKey]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}