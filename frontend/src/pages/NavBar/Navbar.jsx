import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../state";
import { useNavigate, useLocation } from "react-router-dom";
import Friend from "../../components/Friend";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";
  const token = useSelector((state) => state.token);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setAllUsers(data);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, [token]);

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    const results = allUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(inputValue.toLowerCase()) ||
        user.lastName.toLowerCase().includes(inputValue.toLowerCase())
    );

    setSearchResults(results);
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
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-200 rounded-lg py-2 px-4 w-56 sm:w-64 focus:outline-none"
          value={searchInput}
          onChange={handleSearchInputChange}
        />

        {/* Search Results Prompt */}
        {searchInput && searchResults.length > 0 && (
          <div className="absolute left-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg z-10">
            {searchResults.map((result) => (
              <Friend
                key={result._id}
                friendId={result._id}
                name={`${result.firstName} ${result.lastName}`}
                subtitle={result.email} // Adjust as per your data structure
                userPicturePath={result.picturePath} // Adjust as per your data structure
                showButton={result._id !== user._id} // Don't show button for self
              />
            ))}
          </div>
        )}
      </div>

      {/* User Info and Logout Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
