import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md">
      {/* Friend Component */}
      <div className="flex items-center">
        <img
          className="w-8 h-8 rounded-full mr-2"
          src={`http://localhost:3001/assets/${userPicturePath}`}
          alt="User"
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-gray-500">{location}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mt-4">{description}</p>

      {/* Post Image */}
      {picturePath && (
        <img
          className="mt-4 rounded-lg"
          src={`http://localhost:3001/assets/${picturePath}`}
          alt="Post"
        />
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-2">
        {/* Like Button */}
        <div className="flex items-center space-x-1">
          <button onClick={patchLike} className="focus:outline-none">
            {isLiked ? (
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
                  d="M19 9l-7 7-7-7"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </button>
          <span className="text-gray-700">{likeCount}</span>
        </div>

        {/* Comments Button */}
        <button
          onClick={() => setIsComments(!isComments)}
          className="flex items-center space-x-1 focus:outline-none"
        >
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
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <span className="text-gray-700">{comments.length}</span>
        </button>
      </div>

      {/* Share Button */}
      <button className="mt-2 focus:outline-none">
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
            d="M20 12H4m16-4l-4-4m4 4l-4 4m0 5.236V20m0-8.764l4-4-4-4"
          />
        </svg>
      </button>

      {/* Comments Section */}
      {isComments && (
        <div className="mt-2">
          {comments.map((comment, i) => (
            <div key={`${name}-${i}`} className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              <p className="text-gray-700">{comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostWidget;
