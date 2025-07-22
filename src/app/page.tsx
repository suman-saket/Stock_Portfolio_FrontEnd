"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import SimpleTable from "./components/SimpleTable";
import { API_ENDPOINTS, USER_ID } from "@/config/api";
import { Stock, TableColumn, CellInfo } from "@/types/stock";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function Home() {
  const [sector, setSector] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    stockName: "",
    purchasePrice: "",
    quantity: "",
    investment: "",
    portfolio: "",
    exchangeCode: "NSE", 
    sector: ""
  });

   useEffect(() => {
    setIsLoading(true);
    fetch(API_ENDPOINTS.PORTFOLIO.LIVE)
      .then((res) => res.json())
      .then((stocks) => {
        setData(stocks);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const sectors = useMemo(() => {
    return Array.from(new Set(data.map((s) => s.sector)));
  }, [data]);

  const filteredData = useMemo(() => {
    if (!sector) return data;
    return data.filter((s) => s.sector === sector);
  }, [data, sector]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const requestBody = {
        userId: USER_ID,
        stockName: formData.stockName,
        purchasePrice: parseFloat(formData.purchasePrice),
        quantity: parseInt(formData.quantity),
        investment: parseFloat(formData.investment),
        portfolio: parseInt(formData.portfolio),
        exchangeCode: formData.exchangeCode,
        sector: formData.sector
      };
      
      const response = await fetch(API_ENDPOINTS.PORTFOLIO.ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to add stock');
      }

      const newStock = await response.json();
      setData(prev => [...prev, newStock]);
      setIsModalOpen(false);
      setFormData({
        stockName: "",
        purchasePrice: "",
        quantity: "",
        investment: "",
        portfolio: "",
        exchangeCode: "NSE",
        sector: ""
      });
    } catch (error) {
      console.error("Error adding stock:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const columns: TableColumn[] = useMemo(() => [
    { accessorKey: "stockName", header: "Stock Name" },
    { accessorKey: "purchasePrice", header: "Purchase Price", cell: (info: CellInfo) => `₹${info.getValue()}` },
    { accessorKey: "quantity", header: "Qty" },
    { accessorKey: "investment", header: "Investment", cell: (info: CellInfo) => `₹${info.getValue()}` },
    { accessorKey: "portfolio", header: "Portfolio %", cell: (info: CellInfo) => `${info.getValue()}%` },
    { accessorKey: "cmp", header: "CMP", cell: (info: CellInfo) => `₹${Number(info.getValue() || 0).toFixed(2)}` },
    { accessorKey: "exchangeCode", header: "Exchange Code" },
    { accessorKey: "peRatio", header: "P/E Ratio" },
    { accessorKey: "earnings", header: "Earnings" },
    { accessorKey: "sector", header: "Sector" },
  ], []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans p-4">
      <div className="w-full mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 drop-shadow-sm">
          Stock  Portfolio Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Stocks</p>
                <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Investment</p>
                <p className="text-2xl font-bold text-gray-900">₹{formatCurrency(filteredData.reduce((sum, stock) => sum + stock.investment, 0))}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Sectors</p>
                <p className="text-2xl font-bold text-gray-900">{sectors.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Avg. Investment</p>
                <p className="text-2xl font-bold text-gray-900">₹{Math.round(filteredData.reduce((sum, stock) => sum + stock.investment, 0) / filteredData.length || 0).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full border border-white/30 hover:shadow-3xl transition-all duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <button
              onClick={handleModalOpen}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 transform hover:scale-105"
            >
              <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add New Stock</span>
              <div className="w-2 h-2 bg-white/30 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
            </button>
            
            <div className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-xl border border-gray-200/50">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              <label htmlFor="sector" className="font-semibold text-gray-700 text-sm">Filter by Sector:</label>
              <select
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="border-0 bg-white p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 font-medium min-w-[150px] cursor-pointer"
              >
                <option value="">All Sectors</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : (
            <SimpleTable data={filteredData} columns={columns} pageSize={10} />
          )}
        </div>

        {isModalOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
            onClick={handleModalClose}
          >
            <div 
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-scale-in border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold">Add New Stock</h3>
                  </div>
                  <button
                    onClick={handleModalClose}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Stock Name
                      </label>
                      <input
                        type="text"
                        name="stockName"
                        value={formData.stockName}
                        onChange={handleFormChange}
                        required
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white text-gray-800"
                        placeholder="e.g., Reliance Industries Ltd"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Purchase Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          name="purchasePrice"
                          value={formData.purchasePrice}
                          onChange={handleFormChange}
                          required
                          className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                          placeholder="2850.50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleFormChange}
                        required
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                        placeholder="10"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Total Investment
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          name="investment"
                          value={formData.investment}
                          onChange={handleFormChange}
                          required
                          className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                          placeholder="28505.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Portfolio %
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleFormChange}
                          required
                          className="w-full pr-8 pl-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                          placeholder="1"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Exchange
                      </label>
                      <select
                        name="exchangeCode"
                        value={formData.exchangeCode}
                        onChange={handleFormChange}
                        required
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50/50 cursor-pointer"
                      >
                        <option value="NSE">NSE</option>
                        <option value="BSE">BSE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Sector
                      </label>
                      <input
                        type="text"
                        name="sector"
                        value={formData.sector}
                        onChange={handleFormChange}
                        required
                        className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                        placeholder="e.g., Technology, Banking"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={handleModalClose}
                      className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200 hover:border-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Add Stock
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
