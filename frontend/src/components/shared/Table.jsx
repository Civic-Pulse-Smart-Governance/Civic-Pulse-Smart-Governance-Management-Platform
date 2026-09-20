export default function Table({ columns, children }) {
  return (
    <div className="overflow-x-auto -mx-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 text-xs uppercase tracking-wide border-b border-slate-100">
            {columns.map((col) => (
              <th key={col} className="px-6 py-3 font-semibold whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = '', ...props }) {
  return (
    <td className={`px-6 py-4 align-middle ${className}`} {...props}>
      {children}
    </td>
  );
}
