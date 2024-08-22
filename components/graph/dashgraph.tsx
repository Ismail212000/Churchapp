"use client";
import React from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
 
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
 
export default function Dashboard() {
  const data = {
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE'],
    datasets: [
      {
        label: '',
        data: [1500, 10000 ,150000, 20000, 69032 ,9000],
        fill: false,
        borderColor: 'rgb(0, 112, 244)',
        tension: 0.4,
      },
      {
        label: '',
        data: [1500,22000, 190000, 203000 ,2000,100000],
        fill: false,
        borderColor: 'rgb(34, 197, 94)', // Red
        tension: 0.4,  
      },
    ],
  };
 
  const options = {
    responsive: true,
    plugins: {
    //   legend: {
    //     position: 'top' as const,
    //   },
      title: {
        display: true,
        text: '2021  -  2022 ',
      },
    },
  };
 
  return (
      <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-8">
 
        {/* Donor Table */}
        <div className="bg-white rounded-3xl shadow-lg p-6 w-full lg:w-1/2 h-auto">
          <div className="grid grid-cols-4 gap-2 font-normal text-gray-700 mb-6">
            <div>New Donors</div>
            <div className="pl-14">Type</div>
            <div className="pl-8">Country</div>
            <div>Amount</div>
          </div>
 
          {/* Donors */}
          <div className="grid grid-cols-4 gap-4 items-center mb-4">
            <div className="flex items-center space-x-2">
              <img
                className="w-10 h-10 rounded-full"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="Donor 1"
              />
              <span className="whitespace-nowrap">Larry Lawson</span>
            </div>
            <div className="pl-12">+12345</div>
            <div className="pl-8">
              <button className="bg-blue-500 text-white px-2 py-0 rounded-full hover:bg-blue-600">
                IND
              </button>
            </div>
            <div>₹500</div>
          </div>
 
          <div className="grid grid-cols-4 gap-4 items-center mb-4">
            <div className="flex items-center space-x-2">
              <img
                className="w-10 h-10 rounded-full"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="Donor 2"
              />
              <span className="whitespace-nowrap">Judy Nguyen</span>
            </div>
            <div className="pl-12">Salary</div>
            <div className="pl-8">
              <button className="bg-green-500 text-white px-2 py-0 rounded-full hover:bg-green-600">
                USA
              </button>
            </div>
            <div>$1200</div>
          </div>
           <div className="grid grid-cols-4 gap-4 items-center mb-4">
            <div className="flex items-center space-x-2">
              <img
                className="w-10 h-10 rounded-full"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="Donor 3"
              />
              <span className="whitespace-nowrap">Bryan Knight</span>
            </div>
            <div className="pl-12">Bonas</div>
            <div className="pl-8">
              <button className="bg-blue-500 text-white px-2 py-0 rounded-full hover:bg-blue-600">
                IND
              </button>
            </div>
            <div>₹750</div>
          </div>
 
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="flex items-center space-x-2">
              <img
                className="w-10 h-10 rounded-full"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                alt="Donor 4"
              />
              <span className="whitespace-nowrap">Larry Lawson</span>
            </div>
            <div className="pl-12">Salary</div>
            <div className="pl-8">
              <button className="bg-green-500 text-white px-2 py-0 rounded-full hover:bg-green-600">
                AUS
              </button>
            </div>
            <div>$950</div>
          </div>
          
        </div>
 
        {/* Graph Card */}
        <div className="bg-white rounded-3xl shadow-lg p-6 w-full lg:w-1/2 h-auto">
          <h2 className=" flex text-2xl font-normal text-gray-800 mb-0">Donation</h2>
         
         
          <div className="flex justify-center h-auto">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
  );
}