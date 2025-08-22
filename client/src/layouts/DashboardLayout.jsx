import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  const scrollRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-white dark:bg-neutral-900 transition-colors duration-300">
      {/* Sidebar Fixed Left */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Fixed Navbar at Top */}
        <div className="sticky top-0 z-40">
          <Navbar />
        </div>

        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-neutral-950"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
