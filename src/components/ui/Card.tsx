import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  title?: string;
  className?: string;
};

export default function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-sm ${className}`}>
      {title && <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>}
      {children}
    </div>
  );
}