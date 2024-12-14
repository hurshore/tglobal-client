'use client';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  hasMore,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
      >
        Previous
      </button>
      
      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages || 1}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
      >
        Next
      </button>
    </div>
  );
}
