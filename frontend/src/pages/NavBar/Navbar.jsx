import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogout, removeNotification } from "../../state";
import { useNavigate, useLocation } from "react-router-dom";
import Friend from "../../components/Friend";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";
  const token = useSelector((state) => state.token);
  const notifications = useSelector(
    (state) => state.userNotifications[user?._id] || []
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsNotificationOpen(false);
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

  const handleRemoveNotification = (id) => {
    dispatch(removeNotification({ userId: user._id, notificationId: id }));
  };

  return (
    <nav className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Logo */}
      <h1
        className="font-bold text-2xl text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => navigate("/home")}
      >
        Sociopedia
      </h1>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="bg-purple-200 rounded-lg py-2 px-4 w-56 sm:w-64 focus:outline-none focus:bg-purple-300 transition duration-300 ease-in-out"
          value={searchInput}
          onChange={handleSearchInputChange}
        />

        {/* Search Results Prompt */}
        {searchInput && searchResults.length > 0 && (
          <div className="absolute left-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
            {searchResults.map((result) => (
              <Friend
                key={result._id}
                friendId={result._id}
                name={`${result.firstName} ${result.lastName}`}
                subtitle={result.email}
                userPicturePath={result.picturePath}
                showButton={result._id !== user._id}
              />
            ))}
          </div>
        )}
      </div>

      {/* User Info, Notification and Logout Dropdown */}
      <div className="relative flex items-center" ref={dropdownRef}>
        {/* Notification Button */}
        <button
          className="p-2 rounded-lg bg-purple-200 hover:bg-purple-300 focus:outline-none mr-4 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setIsNotificationOpen(!isNotificationOpen)}
          aria-expanded={isNotificationOpen}
        >
          <span className="text-white">
            Notifications ({notifications.length})
          </span>
        </button>

        {/* Notifications Dropdown */}
        {isNotificationOpen && (
          <div className="absolute right-0 mt-24 py-2 w-80 bg-white rounded-lg shadow-lg z-10 overflow-hidden animate__animated animate__fadeIn">
            {notifications.length === 0 ? (
              <p className="px-4 py-2 text-gray-700">No new notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
                >
                  <p>{notification.message}</p>
                  <button
                    onClick={() => handleRemoveNotification(notification.id)}
                    className="text-red-500"
                  >
                    Dismiss
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* User Info Dropdown */}
        <button
          className="p-2 rounded-lg bg-purple-200 hover:bg-purple-300 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
        >
          <span className="text-white">{fullName}</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-24 py-2 w-48 bg-white rounded-lg shadow-lg z-10 overflow-hidden animate__animated animate__fadeIn">
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
