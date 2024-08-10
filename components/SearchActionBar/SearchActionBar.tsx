"use client";

import React, { ChangeEventHandler, MouseEventHandler } from "react";
import { FiSearch, FiFilter, FiDownload, FiPrinter } from "react-icons/fi";

interface SearchActionBarProps {
  onSearch: ChangeEventHandler<HTMLInputElement>;
  onFilter: MouseEventHandler<HTMLButtonElement>;
  onExport: MouseEventHandler<HTMLButtonElement>;
  onPrint: MouseEventHandler<HTMLButtonElement>;
}

const SearchActionBar: React.FC<SearchActionBarProps> = ({
  onSearch,
  onFilter,
  onExport,
  onPrint,
}) => {
  return (
    <div className="flex justify-between items-center p-6">
      <div className="flex items-center w-full max-w-xl">
        <FiSearch className="text-[#280559] mr-2" />
        <input
          type="text"
          placeholder="Search for invoice"
          onChange={onSearch}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onFilter}
          className="flex items-center p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none text-xs"
        >
          <FiFilter className="text-[#280559] mr-1" />
          Filters
        </button>
        <button
          onClick={onExport}
          className="flex items-center p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none text-xs"
        >
          <FiDownload className="text-[#280559] mr-1" />
          Export
        </button>
        <button
          onClick={onPrint}
          className="flex items-center p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none text-xs"
        >
          <FiPrinter className="text-[#280559] mr-1" />
          Print
        </button>
      </div>
    </div>
  );
};

export default SearchActionBar;
