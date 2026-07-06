import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
}

export function DataTable<T>({ data, columns, onRowClick, isLoading }: DataTableProps<T>) {
  if (isLoading) {
    return <div className="p-8 text-center text-muted">Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-muted bg-card border border-border rounded-xl">No data found</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/5 border-b border-border text-muted uppercase text-xs">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((row, i) => (
            <tr 
              key={i} 
              onClick={() => onRowClick?.(row)}
              className={`transition-colors hover:bg-muted/5 ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {columns.map((col, j) => (
                <td key={j} className="px-6 py-4">
                  {typeof col.accessor === 'function' 
                    ? col.accessor(row) 
                    : String(row[col.accessor] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
