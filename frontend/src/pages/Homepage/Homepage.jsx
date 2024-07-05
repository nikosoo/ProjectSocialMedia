import Navbar from "../NavBar/Navbar";
import MyPostWidget from "../widgets/MyPostWidget";
import UserWidget from "../widgets/UserWidget";
import { useSelector } from "react-redux";
import PostsWidget from "../widgets/PostsWidget";

const HomePage = () => {
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-1">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  User Profile
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <UserWidget userId={_id} picturePath={picturePath} />
              </div>
            </div>
          </div>
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
          <div className="md:col-span-1">
            {/* Add additional content here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
