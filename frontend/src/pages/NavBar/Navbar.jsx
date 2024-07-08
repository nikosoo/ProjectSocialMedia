import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  const handleToggleMobileMenu = () => {
    setIsMobileMenuToggled(!isMobileMenuToggled);
  };

  useEffect(() => {
    setIsMobileMenuToggled(false);
  }, [location]);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-100 px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1
        className="font-bold text-2xl text-primary cursor-pointer"
        onClick={() => navigate("/home")}
      >
        Sociopedia
      </h1>

      {/* Search Input (for non-mobile screens) */}
      <div className="hidden md:flex bg-gray-200 rounded-lg gap-7 px-4 py-1.5">
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow bg-transparent focus:outline-none"
        />
        <button className="p-2 rounded-lg bg-gray-300 hover:bg-gray-400 focus:outline-none">
          {/* Replace with your preferred burger menu SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-7 items-center">
        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            {fullName}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-10">
              <button
                className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                onClick={() => {
                  dispatch(setLogout());
                  setIsDropdownOpen(false);
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Toggle */}
      <button
        className="md:hidden p-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
        onClick={handleToggleMobileMenu}
      >
        {/* Replace with your preferred burger menu SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="20"
          height="20"
          viewBox="0 0 50 50"
        >
          <path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 Z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 Z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 Z"></path>
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuToggled && (
        <div className="fixed inset-0 right-0 bottom-0 bg-gray-100 md:hidden">
          <div className="flex flex-col items-center justify-center gap-7 p-8">
            {/* Close Icon */}
            <button
              className="absolute top-0 right-0 p-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
              onClick={handleToggleMobileMenu}
            >
              <svg
                className="w-6 h-6 text-gray-800"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                {/* Close Icon SVG */}
                <path
                  fillRule="evenodd"
                  d="M19.293 5.293l-14 14a1 1 0 1 1-1.414-1.414l14-14a1 1 0 1 1 1.414 1.414z"
                />
              </svg>
            </button>

            {/* Mobile Menu Items (Dark Mode, Messages, Notifications, Help) */}
            {/* (SVG Icons for these buttons are not shown in the snippet) */}

            {/* Mobile User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                {fullName}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-lg z-10">
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      dispatch(setLogout());
                      setIsDropdownOpen(false);
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
