"use client";
import React from "react";
import Dashboard from "@/components/dashboard/dashboard";
import Graph from "@/components/graph/dashgraph";

const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-wrap justify-between p-4">
      <div className="w-full md:w p-2">
        <Dashboard />
      </div>
      <div className="w-full md:w p-2">
        <Graph />
      </div>
    </div>
  );
};

export default DashboardPage;