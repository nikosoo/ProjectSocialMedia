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
          <svg
            className="w-6 h-6 text-gray-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {/* Search Icon SVG */}
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-7 items-center">
        {/* Dark Mode / Light Mode Toggle */}
        <button
          className="p-2 rounded-lg bg-transparent hover:bg-gray-200 focus:outline-none"
          onClick={() => dispatch(setMode())}
          aria-label="Toggle Dark Mode"
        >
          {/* Mode Icon SVG */}
        </button>

        {/* Other icons (Message, Notifications, Help) */}
        <button className="p-2 rounded-lg bg-transparent hover:bg-gray-200 focus:outline-none">
          <svg
            className="w-6 h-6 text-gray-800"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {/* Message Icon SVG */}
          </svg>
        </button>
        <button className="p-2 rounded-lg bg-transparent hover:bg-gray-200 focus:outline-none">
          <svg
            className="w-6 h-6 text-gray-800"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {/* Notifications Icon SVG */}
          </svg>
        </button>
        <button className="p-2 rounded-lg bg-transparent hover:bg-gray-200 focus:outline-none">
          <svg
            className="w-6 h-6 text-gray-800"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {/* Help Icon SVG */}
          </svg>
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            {fullName}
            <svg
              className="w-4 h-4 ml-1 text-gray-800"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {/* Dropdown Icon SVG */}
            </svg>
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
        <svg
          className="w-6 h-6 text-gray-800"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Menu Icon SVG */}
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
                <svg
                  className="w-4 h-4 ml-1 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  {/* Dropdown Icon SVG */}
                </svg>
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
