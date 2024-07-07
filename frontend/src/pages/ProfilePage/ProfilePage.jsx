import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);

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
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []); // Run once on component mount

  if (!user) return null; // Render nothing until user data is fetched

  return (
    <div>
      <Navbar />
      <div className="w-full p-8 flex flex-col lg:flex-row gap-8 justify-center">
        <div className="lg:w-1/4">
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <div className="my-8" />
          <FriendListWidget userId={userId} />
        </div>
        <div className="lg:w-2/5 mt-8 lg:mt-0">
          <MyPostWidget picturePath={user.picturePath} />
          <div className="my-8" />
          <PostsWidget userId={userId} isProfile />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
