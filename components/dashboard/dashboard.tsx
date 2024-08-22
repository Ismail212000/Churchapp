import React from 'react';
import { FaUserFriends, FaChartLine } from 'react-icons/fa';
import { PiMoneyDuotone } from 'react-icons/pi';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-[#280559] font-bold text-xl">Dashboard</h1>
          <p className="text-[#9898A3] text-xs">View all status from the dashboard</p>
        </div>
      </div>
      <div className="flow-root bg-gray-100">
        {/* Main content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white shadow-lg rounded-3xl p-4 border border-purple-300">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-lg font-semibold text-gray-800">Total Donation</div>
                  <div className="text-2xl font-bold text-gray-900">25.1L</div>
                  <div className="text-green-500 flex items-center mt-1">
                    <div className="bg-green-100 p-1 rounded-full">
                      <BiTrendingUp className="text-green-500" />
                    </div>
                    <span className="text-sm ml-1">+15%</span>
                  </div>
                </div>
                <PiMoneyDuotone className="text-3xl text-black-500" />
              </div>
              <div className="text-purple-500 underline cursor-pointer mt-2">
                <span className="flex justify-center">View all</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-lg rounded-3xl p-4 border border-purple-300">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-lg font-semibold text-gray-800">Prayer Request</div>
                  <div className="text-2xl font-bold text-gray-900">35</div>
                  <div className="text-red-500 flex items-center mt-1">
                    <div className="bg-red-100 p-1 rounded-full">
                      <BiTrendingDown className="text-red-500" />
                    </div>
                    <span className="text-sm ml-1">-3.5%</span>
                  </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg"className="text-3xl text-black-500"width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor"><path d="M15.5 15L14 10.5c-1.657 0-2 1.343-2 3V15m-3.5 0l1.5-4.5c1.657 0 2 1.343 2 3V15"/><path d="M21.978 22c-1.15-.67-3.086-2.186-5.69-1.992c-.659.049-.989.074-1.29.05a3 3 0 0 1-.327-.029C13.139 19.674 12 18.336 12 16.74V3.196a1.197 1.197 0 0 1 2.304-.453l2.718 6.644c1.066 2.605 1.599 3.907 2.528 4.577c.057.042.163.113.223.15c.971.606 1.39.606 2.227.606M2.022 22c1.15-.67 3.086-2.186 5.69-1.992c.659.049.989.074 1.29.05s.31-.025.327-.029C10.861 19.675 12 18.336 12 16.74V3.196a1.197 1.197 0 0 0-2.304-.453L6.978 9.388c-1.066 2.605-1.599 3.908-2.528 4.577a5 5 0 0 1-.223.15c-.971.606-1.39.606-2.227.606"/></g></svg>
              </div>
              <div className="text-purple-500 underline cursor-pointer mt-2">
                <span className="flex justify-center">View all</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-lg rounded-3xl p-4 border border-purple-300">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-lg font-semibold text-gray-800">New Users</div>
                  <div className="text-2xl font-bold text-gray-900">55</div>
                  <div className="text-green-500 flex items-center mt-1">
                    <div className="bg-green-100 p-1 rounded-full">
                      <BiTrendingUp className="text-green-500" />
                    </div>
                    <span className="text-sm ml-1">+15%</span>
                  </div>
                </div>
                <FaUserFriends className="text-3xl text-black-500" />
              </div>
              <div className="text-purple-500 underline cursor-pointer mt-2">
                <span className="flex justify-center">View all</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white shadow-lg rounded-3xl p-4 border border-purple-300">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="text-lg font-semibold text-gray-800">Website Visits</div>
                  <div className="text-2xl font-bold text-gray-900">43.5k</div>
                  <div className="text-green-500 flex items-center mt-1">
                    <div className="bg-green-100 p-1 rounded-full">
                      <BiTrendingUp className="text-green-500" />
                    </div>
                    <span className="text-sm ml-1">+10%</span>
                  </div>
                </div>
                <FaChartLine className="text-3xl text-black-500" />
              </div>
              <div className="text-purple-500 underline cursor-pointer mt-2">
                <span className="flex justify-center">View all</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};
export default Dashboard;