/**
 * Skeleton Loader Components
 * Loading placeholders for various content types
 */

'use client';

export function ProductCardSkeleton() {
  return (
    <div className="card bg-white overflow-hidden shadow-sm animate-pulse">
      <div className="bg-gray-200 h-40 w-full"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

export function SupplierRowSkeleton() {
  return (
    <tr className="border-b animate-pulse">
      <td className="py-2"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
      <td className="py-2"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="py-2"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
      <td className="py-2"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
      <td className="py-2"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
      <td className="py-2"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card bg-white p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
      <div className="h-8 bg-gray-200 rounded w-32"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pb-2"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="pb-2"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="pb-2"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
            <th className="pb-2"><div className="h-4 bg-gray-200 rounded w-20"></div></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SupplierRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

