import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "../state";
import UserImage from "./UserImage";

const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id, friends } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const isFriend =
    Array.isArray(friends) && friends.find((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <UserImage image={userPicturePath} size="60" />
        <div
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
          className="cursor-pointer"
        >
          <p className="text-lg font-medium text-gray-800 hover:text-blue-500">
            {name}
          </p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button
        onClick={patchFriend}
        className={`p-2 rounded-full ${
          isFriend ? "bg-blue-100" : "bg-gray-100"
        }`}
      >
        {isFriend ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 13v4m0 0v4m0-4h4m-4 0H3m0 0a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6h0a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v0H3v-6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Friend;
