import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state";
import Friend from "../../components/Friend";

const FriendListWidget = ({ userId, isProfilePage }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId, token, dispatch]);

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-md">
      <h2 className="text-neutral-dark text-xl font-medium mb-6">
        Friend List
      </h2>
      <div className="flex flex-col gap-6">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            showButton={!isProfilePage} // Pass showButton prop based on isProfilePage
          />
        ))}
      </div>
    </div>
  );
};

export default FriendListWidget;
