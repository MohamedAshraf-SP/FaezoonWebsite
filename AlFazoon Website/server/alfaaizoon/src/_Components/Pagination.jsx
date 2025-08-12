import React from "react";

export default function Pagination({
  currentPage,
  pagecount,
  onPageChange,
  loading,
}) {
  const generatePageNumbers = () => {
    let pages = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(pagecount, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 2) {
      pages.unshift("...");
      pages.unshift(1);
    }
    if (endPage < pagecount - 1) {
      pages.push("...");
      pages.push(pagecount);
    }

    return pages;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagecount) {
      onPageChange(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      <button
        onClick={handlePrevPage}
        disabled={currentPage === 1 || loading}
        className={`inline-flex items-center justify-center px-2 py-1 outline-none rounded border border-solid border-gray-300 bg-white text-gray-700 ${
          currentPage === 1 || loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        {/* SVG for previous arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {generatePageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => onPageChange(page)}
          disabled={page === "..." || loading}
          className={`px-4 py-1 rounded border outline-none border-solid border-gray-300 ${
            page === currentPage
              ? "bg-blue-600 text-white"
              : page === "..."
              ? "cursor-default"
              : "bg-white text-gray-700 hover:bg-gray-100"
          } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextPage}
        disabled={currentPage === pagecount || loading}
        className={`inline-flex items-center justify-center px-2 py-1 outline-none rounded border border-solid border-gray-300 bg-white text-gray-700 ${
          currentPage === pagecount || loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        {/* SVG for next arrow */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
