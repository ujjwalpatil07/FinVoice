import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import { useUserContext } from "../context/UserContext";

export default function DashboardLayout({ children }) {
  const scrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser, authUserLoading } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const userToken = localStorage.getItem("authUser");
    if (!userToken) {
      enqueueSnackbar("User not signed in. Redirecting to login...", { variant: 'warning' });
      navigate("/login", { replace: true });
    }
  }, [enqueueSnackbar, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  if (authUserLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  if (!authUser) {
    navigate("/login", { replace: true });
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-white dark:bg-neutral-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen">
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
