import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../state";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

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

      {/* Search Input */}
      <div className="flex bg-gray-200 rounded-lg gap-7 px-4 py-1.5 w-full md:w-auto sm:w-auto max-sm:w-[35%]">
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow bg-transparent focus:outline-none max-sm:w-[35%]"
        />
        <button className="p-2 rounded-lg bg-gray-300 hover:bg-gray-400 focus:outline-none">
          {/* Replace with your preferred search icon SVG */}
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

      {/* User Info and Logout Dropdown */}
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
    </nav>
  );
};

export default Navbar;
