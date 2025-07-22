import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-8 rounded-lg mb-6 w-1/3"></div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="bg-gray-200 h-4 rounded w-2/3 mb-2"></div>
                <div className="bg-gray-300 h-6 rounded w-1/2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Table Skeleton */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full border border-white/30">
        {/* Controls Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-gray-200 h-10 rounded-xl w-32"></div>
          <div className="bg-gray-200 h-10 rounded-xl w-40"></div>
        </div>
        
        {/* Table Header Skeleton */}
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 h-12"></div>
          
          {/* Table Rows Skeleton */}
          <div className="bg-white">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex items-center px-6 py-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <div className="w-8 h-8 bg-gray-200 rounded-lg mr-3"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
                <div className="bg-gray-200 h-4 rounded w-16 mx-4"></div>
                <div className="bg-gray-200 h-4 rounded w-12 mx-4"></div>
                <div className="bg-gray-200 h-4 rounded w-20 mx-4"></div>
                <div className="bg-gray-200 h-4 rounded w-8 mx-4"></div>
                <div className="bg-gray-200 h-4 rounded w-12 mx-4"></div>
                <div className="bg-gray-200 h-4 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
