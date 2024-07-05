import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "../../components/UserImage"; // Adjust path as necessary
import { useNavigate } from "react-router-dom"; // Import useNavigate

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const token = useSelector((state) => state.token);
  const navigate = useNavigate(); // Initialize useNavigate

  const getUser = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  const navigateToProfile = () => {
    // Navigate to profile page using navigate function
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* FIRST ROW */}
      <div
        className="flex justify-between items-center gap-2 pb-7 cursor-pointer"
        onClick={navigateToProfile}
      >
        <div className="flex items-center gap-4">
          <UserImage image={picturePath} size="60px" />
          <div>
            <h4 className="text-lg font-medium">
              {firstName} {lastName}
            </h4>
            <p className="text-gray-600">{friends.length} friends</p>
          </div>
        </div>
        <svg
          className="h-6 w-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>

      <hr className="my-4" />

      {/* SECOND ROW */}
      <div className="py-4">
        <div className="flex items-center gap-4 mb-2">
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <p className="text-gray-600">{location}</p>
        </div>
        <div className="flex items-center gap-4">
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 6h18M3 10h18M3 14h18M3 18h18"
            />
          </svg>
          <p className="text-gray-600">{occupation}</p>
        </div>
      </div>

      <hr className="my-4" />

      {/* THIRD ROW */}
      <div className="py-4">
        <div className="flex justify-between mb-2">
          <p className="text-gray-600">Who's viewed your profile</p>
          <p className="text-gray-900 font-medium">{viewedProfile}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600">Impressions of your post</p>
          <p className="text-gray-900 font-medium">{impressions}</p>
        </div>
      </div>

      <hr className="my-4" />

      {/* FOURTH ROW */}
      <div className="py-4">
        <p className="text-gray-900 font-medium mb-4">Social Profiles</p>

        <div className="flex justify-between items-center gap-4 mb-2">
          <div className="flex items-center gap-4">
            <img
              className="h-6 w-6"
              src="../assets/twitter.png"
              alt="twitter"
            />
            <div>
              <p className="text-gray-900 font-medium">Twitter</p>
              <p className="text-gray-600">Social Network</p>
            </div>
          </div>
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              className="h-6 w-6"
              src="../assets/linkedin.png"
              alt="linkedin"
            />
            <div>
              <p className="text-gray-900 font-medium">LinkedIn</p>
              <p className="text-gray-600">Network Platform</p>
            </div>
          </div>
          <svg
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UserWidget;
