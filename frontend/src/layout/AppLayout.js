import React,{useEffect} from 'react';
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AppLayout() {
  return (
    <div className="flex h-screen !bg-gray-100 overflow-hidden">

      {/* Sidebar (fixed width, no shrink) */}
      {/* <Sidebar roles="phq" /> */}

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header (fixed) */}
        <Header />

        {/* PAGE SCROLL (Y-axis browser style) */}
        <main className="flex-1 overflow-y-auto p-6">

          <div className="w-full">
            <Outlet />
          </div>

        </main>

      </div>
    </div>
  );
}