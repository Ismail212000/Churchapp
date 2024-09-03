"use client";
import { useState } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { BsFillPlusSquareFill } from "react-icons/bs";

interface AddMediaProps {
  className?: string;
  onClick?: () => void;
  onSetHandleTab?: (type: string) => void;
}

const AddMedia: React.FC<AddMediaProps> = ({ className, onClick, onSetHandleTab }) => {
  const [currentTab, setCurrentTab] = useState<string>("Video");

  const HandleClick = (tab: string) => {
    setCurrentTab(tab);
    if (onSetHandleTab) {
      onSetHandleTab(tab);
    }
  };

  return (
    <div>
      {/* Tab Selection */}
      <div className="flex justify-start items-center mb-4">
        {["Video", "Image", "Blog", "Audio"].map((tab) => (
          <div
            key={tab}
            className={`${
              currentTab === tab
                ? "border-b-2 rounded text-[#280559] border-[#280559]"
                : "text-[#92929D]"
            } transition-all ease-in-out duration-500 ml-4 cursor-pointer`}
            onClick={() => HandleClick(tab)}
          >
            <p className="sm:px-4 lg:px-8 sm:text-base lg:text-md font-bold mt-10">
              {tab}
            </p>
          </div>
        ))}
      </div>

      {/* Render content based on the selected tab */}
      {/* <div className={className} onClick={onClick}>
        {currentTab === "Video" && (
          <div className="flex justify-center items-center px-1 py-3 border-2 border-dashed border-gray-300 rounded-lg mt-2">
            <div className="text-center">
              <div className="flex justify-center items-center text-black rounded-full mx-auto cursor-pointer">
                <HiOutlineCloudUpload className="w-8 h-8" />
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Browse and choose the video files <br /> you want to upload
              </p>
              <div className="flex justify-center">
                <BsFillPlusSquareFill className="w-6 h-6 text-green-800 cursor-pointer" />
              </div>
              <h1 className="font-bold text-black">Add Video File</h1>
            </div>
          </div>
        )}

        {currentTab === "Image" && (
          <div className="flex justify-center items-center px-1 py-3 border-2 border-dashed border-gray-300 rounded-lg mt-2">
            <div className="text-center">
              <div className="flex justify-center items-center text-black rounded-full mx-auto cursor-pointer">
                <HiOutlineCloudUpload className="w-8 h-8" />
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Browse and choose the image files <br /> you want to upload
              </p>
              <div className="flex justify-center">
                <BsFillPlusSquareFill className="w-6 h-6 text-green-800 cursor-pointer" />
              </div>
              <h1 className="font-bold text-black">Add Image File</h1>
            </div>
          </div>
        )}

        {currentTab === "Blog" && (
          <div className="flex justify-center items-center px-1 py-3 border-2 border-dashed border-gray-300 rounded-lg mt-2">
            <div className="text-center">
              <div className="flex justify-center items-center text-black rounded-full mx-auto cursor-pointer">
                <HiOutlineCloudUpload className="w-8 h-8" />
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Browse and choose the blog content <br /> you want to upload
              </p>
              <div className="flex justify-center">
                <BsFillPlusSquareFill className="w-6 h-6 text-green-800 cursor-pointer" />
              </div>
              <h1 className="font-bold text-black">Create a New Blog Post</h1>
              {/* Add blog post form or editor here */}
            {/* </div>
          </div>
        )}

        {currentTab === "Audio" && (
          <div className="flex justify-center items-center px-1 py-3 border-2 border-dashed border-gray-300 rounded-lg mt-2">
            <div className="text-center">
              <div className="flex justify-center items-center text-black rounded-full mx-auto cursor-pointer">
                <HiOutlineCloudUpload className="w-8 h-8" />
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Browse and choose the audio files <br /> you want to upload
              </p>
              <div className="flex justify-center">
                <BsFillPlusSquareFill className="w-6 h-6 text-green-800 cursor-pointer" />
              </div>
              <h1 className="font-bold text-black">Add Audio File</h1>
            </div>
          </div>
        )}
      </div> */} 
    </div>
  );
};

export default AddMedia;
