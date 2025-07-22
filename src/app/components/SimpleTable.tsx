"use client"
import React, { useState, useMemo, useCallback } from "react";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { Stock, TableColumn } from "@/types/stock";

export type SimpleTableProps = {
  data: Stock[];
  columns: TableColumn[];
  pageSize?: number;
  pageIndex?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
  title?: string;
};

function SimpleTable<T extends object>({ data, columns, pageSize = 10, pageIndex: controlledPageIndex, onPageChange, onPageSizeChange, className, title }: SimpleTableProps<T>) {
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);
  
  const pageIndex = controlledPageIndex !== undefined ? controlledPageIndex : internalPageIndex;
  const currentPageSize = onPageSizeChange ? pageSize : internalPageSize;
  
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(data.length / currentPageSize);
    const paginatedData = data.slice(pageIndex * currentPageSize, (pageIndex + 1) * currentPageSize);
    return { totalPages, paginatedData };
  }, [data, pageIndex, currentPageSize]);

  const table = useReactTable({
    data: paginationData.paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handlePageChange = useCallback((newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPageIndex(newPage);
    }
  }, [onPageChange]);

  const handlePageSizeChange = useCallback((newSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      setInternalPageSize(newSize);
      setInternalPageIndex(0);
    }
  }, [onPageSizeChange]);

  const handlePrevious = useCallback(() => {
    handlePageChange(Math.max(pageIndex - 1, 0));
  }, [handlePageChange, pageIndex]);

  const handleNext = useCallback(() => {
    handlePageChange(Math.min(pageIndex + 1, paginationData.totalPages - 1));
  }, [handlePageChange, pageIndex, paginationData.totalPages]);

  return (
    <div className={className || "rounded-2xl overflow-hidden shadow-lg border border-gray-100"}>
      {title && <h2 className="text-4xl font-extrabold text-left mb-10 text-blue-900 drop-shadow">{title}</h2>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gradient-to-r from-blue-600 to-purple-600">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 text-white font-bold text-left text-sm uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      {header.column.id === 'stockName' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      )}
                      {header.column.id === 'purchasePrice' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      )}
                      {header.column.id === 'quantity' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                      )}
                      {header.column.id === 'investment' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )}
                      {header.column.id === 'portfolio' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                      {header.column.id === 'cmp' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )}
                      {header.column.id === 'peRatio' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      {header.column.id === 'earnings' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      )}
                      {header.column.id === 'exchangeCode' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      )}
                      {header.column.id === 'sector' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map((row, idx) => (
              <tr 
                key={row.id} 
                className={`transition-all duration-200 hover:bg-blue-50/50 hover:shadow-md ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                } group`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {cell.column.id === 'stockName' && (
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
                            <span className="text-white font-bold text-xs">
                              {(cell.getValue() as string)?.charAt(0) || 'S'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                              {flexRender(cell.column.columnDef.cell, cell.getContext()) || 'N/A'}
                            </div>
                          </div>
                        </div>
                      )}
                      {cell.column.id === 'purchasePrice' && (
                        <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          {flexRender(cell.column.columnDef.cell, cell.getContext()) || 'N/A'}
                        </span>
                      )}
                      {cell.column.id === 'quantity' && (
                        <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-center min-w-[3rem] inline-block">
                          {flexRender(cell.column.columnDef.cell, cell.getContext()) || 'N/A'}
                        </span>
                      )}
                      {cell.column.id === 'investment' && (
                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                          {flexRender(cell.column.columnDef.cell, cell.getContext()) || 'N/A'}
                        </span>
                      )}
                      {cell.column.id === 'portfolio' && (
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(parseFloat(cell.getValue() as string || '0') * 10, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-medium text-gray-700">
                            {flexRender(cell.column.columnDef.cell, cell.getContext()) || 'N/A'}
                          </span>
                        </div>
                      )}
                      {cell.column.id === 'cmp' && (
                        <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                          {cell.getValue() ? flexRender(cell.column.columnDef.cell, cell.getContext()) : 'N/A'}
                        </span>
                      )}
                      {cell.column.id === 'peRatio' && (
                        <span className="font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                          {cell.getValue() ? flexRender(cell.column.columnDef.cell, cell.getContext()) : 'N/A'}
                        </span>
                      )}
                      {cell.column.id === 'earnings' && (
                        <span className="font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                          {cell.getValue() ? flexRender(cell.column.columnDef.cell, cell.getContext()) : 'N/A'}
                        </span>
                      )}
                      {cell.column.id === 'exchangeCode' && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cell.getValue() === 'NSE' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext()) || 'N/A'}
                        </span>
                      )}
                      {cell.column.id === 'sector' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                          {flexRender(cell.column.columnDef.cell, cell.getContext()) || 'N/A'}
                        </span>
                      )}
                      {/* Default case for columns that don't have special styling */}
                      {!['stockName', 'purchasePrice', 'quantity', 'investment', 'portfolio', 'cmp', 'peRatio', 'earnings', 'exchangeCode', 'sector'].includes(cell.column.id) && (
                        <span className="text-gray-700">
                          {flexRender(cell.column.columnDef.cell, cell.getContext()) || 'N/A'}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginationData.totalPages > 1 && (
        <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">
                Showing {pageIndex * currentPageSize + 1} to {Math.min((pageIndex + 1) * currentPageSize, data.length)} of {data.length} results
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevious}
                disabled={pageIndex === 0}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200"
                aria-label="Previous page"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, paginationData.totalPages) }, (_, i) => {
                  let pageNum;
                  if (paginationData.totalPages <= 5) {
                    pageNum = i;
                  } else if (pageIndex < 3) {
                    pageNum = i;
                  } else if (pageIndex > paginationData.totalPages - 4) {
                    pageNum = paginationData.totalPages - 5 + i;
                  } else {
                    pageNum = pageIndex - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                        pageIndex === pageNum
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md transform scale-110'
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200 bg-white'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={handleNext}
                disabled={pageIndex === paginationData.totalPages - 1}
                className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200 transition-all duration-200"
                aria-label="Next page"
              >
                Next
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-600 font-medium">Rows per page:</span>
                <select
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent cursor-pointer transition-all duration-200"
                  value={currentPageSize}
                  onChange={e => handlePageSizeChange(Number(e.target.value))}
                >
                  {[10, 20, 30, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(SimpleTable) as typeof SimpleTable;