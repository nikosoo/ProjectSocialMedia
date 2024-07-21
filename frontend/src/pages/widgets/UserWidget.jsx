import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "../../components/UserImage"; // Adjust path as necessary
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiMapPin, FiBriefcase } from "react-icons/fi"; // Import icons from react-icons

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
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="bg-purple-50 rounded-lg shadow-lg p-6">
      {/* FIRST ROW */}
      <div
        className="flex justify-between items-center gap-4 pb-4 cursor-pointer hover:bg-purple-100 transition-colors duration-300"
        onClick={navigateToProfile}
      >
        <div className="flex items-center gap-4">
          <UserImage image={picturePath} size="60px" />
          <div>
            <h4 className="text-xl font-semibold text-purple-800">
              {firstName} {lastName}
            </h4>
            <p className="text-purple-600">{friends.length} friends</p>
          </div>
        </div>
        <FiArrowRight className="h-6 w-6 text-purple-600" />
      </div>

      <hr className="my-4 border-purple-200" />

      {/* SECOND ROW */}
      <div className="py-4">
        <div className="flex items-center gap-4 mb-2">
          <FiMapPin className="h-6 w-6 text-purple-600" />
          <p className="text-purple-700">{location}</p>
        </div>
        <div className="flex items-center gap-4">
          <FiBriefcase className="h-6 w-6 text-purple-600" />
          <p className="text-purple-700">{occupation}</p>
        </div>
      </div>

      <hr className="my-4 border-purple-200" />

      {/* THIRD ROW */}
      <div className="py-4">
        <div className="flex justify-between mb-2">
          <p className="text-purple-600">Who's viewed your profile</p>
          <p className="text-purple-900 font-semibold">{viewedProfile}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-purple-600">Impressions of your post</p>
          <p className="text-purple-900 font-semibold">{impressions}</p>
        </div>
      </div>
    </div>
  );
};

export default UserWidget;
