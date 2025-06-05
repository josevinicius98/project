import { ReactNode } from 'react';

type TableProps = {
  children: ReactNode;
  className?: string;
};

type TableHeadProps = {
  children: ReactNode;
};

type TableBodyProps = {
  children: ReactNode;
};

type TableRowProps = {
  children: ReactNode;
  className?: string;
};

type TableCellProps = {
  children: ReactNode;
  className?: string;
};

type TableHeaderCellProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: TableHeadProps) {
  return <thead className="bg-gray-50">{children}</thead>;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return <tr className={`transition hover:bg-gray-50 ${className}`}>{children}</tr>;
}

export function TableHeaderCell({ children, className = '' }: TableHeaderCellProps) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${className}`}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }: TableCellProps) {
  return <td className={`whitespace-nowrap px-6 py-4 text-sm text-gray-700 ${className}`}>{children}</td>;
}