import React from 'react'
import { FaGreaterThan, FaLessThan } from 'react-icons/fa6'

export type PaginationProps = {
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number) => void
}

export const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }

  return (
    <div className="min-h-[80px] flex items-center justify-center space-x-2">
      {/* Previous */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-semibold font-raleway ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-100'
        }`}>
        <FaLessThan size={14} />
        <span className="font-raleway font-medium text-base text-[#4884DF] leading-[100%]">
          Previous
        </span>
      </button>

      {/* Pages */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-blue-600 hover:bg-blue-100'
          }`}>
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-semibold font-raleway ${
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-100'
        }`}>
        <span className="font-raleway font-medium text-base text-[#4884DF] leading-[100%]">
          Next
        </span>
        <FaGreaterThan size={14} />
      </button>
    </div>
  )
}
