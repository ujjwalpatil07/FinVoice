import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout({ children }) {
    const scrollRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location.pathname]);

    return (
        <div
            ref={scrollRef}
            className="h-screen scroll-smooth flex flex-col overflow-y-auto overflow-x-hidden bg-white dark:bg-neutral-900 transition-colors duration-300"
        >
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto px-3 py-4 sm:px-6 md:py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};
