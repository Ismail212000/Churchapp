"use client";
import { useState } from "react";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { BsFillPlusSquareFill } from "react-icons/bs";

// Replace with your actual Button component import
interface AddMediaProps {
    className?: string;
    onClick?: () => void;
  }
  const AddMedia: React.FC<AddMediaProps> = ({ className, onClick }) => {
  const [currentTab, setCurrentTab] = useState("Video");
  const [newMedia, setNewMedia] = useState({
    id: 0,
    title: "",
    description: "",
    date: "",
    agenda: [{ title: "", time: "" }],
    isPaidEvent: false,
    banner: null,
    repeat: false,
    type: currentTab,
  });

  return (
    <div>
      <div className="flex justify-start items-center mb-4">
        {["Video", "Image", "Blog", "Audio"].map((tab) => (
          <div
            key={tab}
            className={`${
              currentTab === tab
                ? "border-b-2 rounded text-[#280559] border-[#280559]"
                : "text-[#92929D]"
            } transition-all ease-in-out duration-500 ml-4 cursor-pointer`}
            onClick={() => setCurrentTab(tab)}
          >
            <p className="sm:px-4 lg:px-8 sm:text-base lg:text-md font-bold mt-10">
              {tab}
            </p>
          </div>
        ))}
      </div>

      {/* Render different content based on the selected tab */}
      
      <div className={className} onClick={onClick}>
        {(() => {
          switch (currentTab) {
            case "Video":
              return (
                <div className="flex justify-center items-center px-1 py-3 border-2 border-dashed border-gray-300 rounded-lg mt-2 ">
                  <div className="text-center">
                    <div className="flex justify-center items-center text-black rounded-full mx-auto cursor-pointer">
                      <HiOutlineCloudUpload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-2">
                      Browse and choose the vedio files <br/> you want to upload
                        
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <BsFillPlusSquareFill className="w-6 h-6 text-green-800 cursor-pointer" />
                    </div>

                    <div>
                      <h1 className="font-bold text-black">Add Video File</h1>
                    </div>
                  </div>
                </div>
              );
            case "Image":
              return (
                <div className="flex justify-center items-center px-1 py-3 border-2 border-dashed border-gray-300 rounded-lg mt-2">
                  <div className="text-center">
                    <div className="flex justify-center items-center text-black rounded-full mx-auto cursor-pointer">
                      <HiOutlineCloudUpload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-2">
                        Browse and choose the image files <br/> you want to upload
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <BsFillPlusSquareFill className="w-6 h-6 text-green-800 cursor-pointer" />
                    </div>

                    <div>
                      <h1 className="font-bold text-black">Add Image File</h1>
                    </div>
                  </div>
                </div>
              );
            case "Blog":
              return (
                <div className="flex justify-center items-center px-1 py-3 border-2 border-dashed border-gray-300 rounded-lg mt-2">
                  <div className="text-center">
                <div className="flex justify-center items-center text-black rounded-full mx-auto cursor-pointer">
                <HiOutlineCloudUpload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2">
                  Browse and choose the audio files <br/> you want to upload
                </p>
              </div>
              <div className="flex justify-center">
                <BsFillPlusSquareFill className="w-6 h-6 text-green-800 cursor-pointer" />
              </div>

             
                <div>
                  <h1 className="font-bold text-black">Create a New Blog Post</h1>
                  {/* Add blog post form or editor here */}
                </div>
                </div>
                </div>
              );
            case "Audio":
              return (
                
                <div className="flex justify-center items-center px-1 py-3 border-2 border-dashed border-gray-300 rounded-lg mt-2">
                  <div className="text-center">
                    <div className="flex justify-center items-center text-black rounded-full mx-auto cursor-pointer">
                      <HiOutlineCloudUpload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-2">
                        Browse and choose the audio files <br/> you want to upload
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <BsFillPlusSquareFill className="w-6 h-6 text-green-800 cursor-pointer" />
                    </div>

                    <div>
                      <h1 className="font-bold text-black">Add Audio File</h1>
                    </div>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
};

export default AddMedia;
