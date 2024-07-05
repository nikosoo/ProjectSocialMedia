import Navbar from "../NavBar/Navbar";
import MyPostWidget from "../widgets/MyPostWidget";
import UserWidget from "../widgets/UserWidget";
import { useSelector } from "react-redux";
import PostsWidget from "../widgets/PostsWidget";
import FriendListWidget from "../widgets/FriendListWidget";

const HomePage = () => {
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Profile */}
          <div className="md:col-span-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  User Profile
                </h3>
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                <UserWidget userId={_id} picturePath={picturePath} />
              </div>
            </div>
          </div>

          {/* My Posts */}
          <div className="md:col-span-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  My Posts
                </h3>
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                <MyPostWidget picturePath={picturePath} />
              </div>
            </div>
          </div>

          {/* Posts and Friends */}
          <div className="md:col-span-2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Posts
                </h3>
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                <PostsWidget userId={_id} />
              </div>
              <div className="border-t border-gray-200 px-6 py-4">
                <FriendListWidget userId={_id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
