import React, { useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { MdOutlineArrowCircleDown } from "react-icons/md";
import { IoFilterSharp, IoPrintSharp } from "react-icons/io5";
interface SearchProps {
  onGetSearchVal: (value: string) => void;
}
const Tableaction: React.FC<SearchProps> = ({onGetSearchVal}) => {
  const [searchValue, setSearchValue] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onGetSearchVal(value); // Pass the search value to the parent
  };
  return (
    <div className="w-full flex items-center gap-2">
      <div className="bg-[#fff] rounded-[13px] pl-1 pr-1 border border-[#CBD2DC80] w-[65%] h-[40px] flex items-center gap-2">
        <IoMdSearch className="text-[25px]" />
        <input
          type="search"
          placeholder="Search for invoice"
          onChange={(e) => handleSearchChange(e)}
          value={searchValue}
          className="bg-transparent w-full outline-none h-full"
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]">
          <IoFilterSharp className="text-[#280559]" /> <span>Filters</span>
        </button>
        <button className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]">
          <MdOutlineArrowCircleDown className="text-[#280559]" />{" "}
          <span>Export</span>
        </button>
        <button className="flex text-[#280559] items-center bg-[#fff] shadow rounded-[13px] gap-2 justify-center p-2 w-[110px]">
          <IoPrintSharp className="text-[#280559]" /> <span>Print</span>
        </button>
      </div>
    </div>
  );
};
export default Tableaction;