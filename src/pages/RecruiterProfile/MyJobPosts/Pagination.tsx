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
    <div className="min-h-[180px] flex items-center justify-center space-x-2 text-center">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded text-[14px] font-semibold font-raleway text-center ${
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600'
        }`}>
        <div className="flex flex-row space-x-2 items-center justify-center">
          <FaLessThan title="Previous" size={14} />
          <p>Previous</p>
        </div>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded text-center ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-blue-600 hover:bg-blue-100'
          }`}>
          {page}
        </button>
      ))}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded text-[14px] font-semibold font-raleway  ${
          currentPage === totalPages
            ? 'text-gray-400 font-raleway font-medium cursor-not-allowed'
            : 'text-blue-600'
        }`}>
        <div className="flex flex-row space-x-2 items-center justify-center">
          <p>Next</p>
          <FaGreaterThan title="Next" size={14} />
        </div>
      </button>
    </div>
  )
}
