import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { isUserLoggedIn } from "../redux/slice/userSlice";
import useLogout from "../hooks/useLogoutHook";
import { Loader } from "lucide-react";

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isLoggedIn = useSelector(isUserLoggedIn);
    const { handleLogout, isLoading } = useLogout();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const onLogout = () => {
        handleLogout();
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-blue-600">ScrollStack</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={onLogout}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
                                >
                                    {isLoading ? <Loader className="animate-spin" size={15} /> : "Logout"}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-300 inline-block text-center"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600">
                                    Dashboard
                                </Link>
                                <button onClick={onLogout} className="block w-full text-left py-2 text-red-500 hover:text-red-600">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="block w-full text-left py-2 text-blue-500 hover:text-blue-600"
                                >
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
