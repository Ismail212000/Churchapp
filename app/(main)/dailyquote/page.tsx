"use client";
import React from 'react';
import { CalendarWithDailyCode } from '../../../components/actions/dailycode';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Daily Code Calendar</h1>
        <CalendarWithDailyCode />
      </div>
    </div>
  );
};

export default HomePage;
