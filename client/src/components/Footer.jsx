import React from 'react';
import { Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../context/ThemeContext';
import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';

// ✅ Central config for social media links
const socialLinks = [
    { name: 'Twitter', icon: FaXTwitter, url: 'https://twitter.com/YourAppHandle' },
    { name: 'Facebook', icon: FaFacebookF, url: 'https://facebook.com/YourAppPage' },
    { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/YourAppProfile' },
    { name: 'LinkedIn', icon: FaLinkedinIn, url: 'https://linkedin.com/company/YourCompany' },
];

export default function Footer() {
    const { theme, toggleTheme } = useThemeContext();

    return (
        <footer
            className={`transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
        >
            <div className="max-w-7xl mx-auto py-12 px-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">

                    {/* Branding & description */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center space-x-3">
                            <Mic className={`h-8 w-8 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                            <span className="text-2xl font-extrabold select-none">FinVoice</span>
                        </div>
                        <p className="max-w-md leading-relaxed text-sm md:text-base">
                            An AI-powered financial assistant that understands your spending habits and helps you achieve your goals through simple voice commands.
                        </p>

                        {/* Social Media */}
                        <div className="flex space-x-6">
                            {socialLinks.map(({ name, icon, url }) => {
                                const Icon = icon;
                                return (
                                    <a
                                        key={name}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={name}
                                        className={`transition-colors hover:text-indigo-600 focus:text-indigo-600 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </a>
                                );
                            })}

                        </div>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`mt-8 px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition 
                ${theme === 'dark' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        </button>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Product</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/features" className="hover:text-indigo-600 transition">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-indigo-600 transition">Pricing</Link></li>
                            <li><Link to="/testimonials" className="hover:text-indigo-600 transition">Testimonials</Link></li>
                            <li><Link to="/faq" className="hover:text-indigo-600 transition">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/about" className="hover:text-indigo-600 transition">About</Link></li>
                            <li><Link to="/blog" className="hover:text-indigo-600 transition">Blog</Link></li>
                            <li><Link to="/careers" className="hover:text-indigo-600 transition">Careers</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-600 transition">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="mb-4 md:mb-0 select-none">
                        &copy; {new Date().getFullYear()} FinVoice. All rights reserved.
                    </p>
                    <div className="space-x-6">
                        <Link to="/privacy" className="hover:text-indigo-600 transition">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-indigo-600 transition">Terms of Service</Link>
                        <Link to="/cookie" className="hover:text-indigo-600 transition">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
