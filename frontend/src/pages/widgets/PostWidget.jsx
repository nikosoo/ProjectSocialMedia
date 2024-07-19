import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, removePost, addNotification } from "../../state";
import Friend from "../../components/Friend";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

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
  isProfile,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const loggedInUserName = `${useSelector(
    (state) => state.user?.firstName
  )} ${useSelector((state) => state.user?.lastName)}`;
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

    if (postUserId !== loggedInUserId) {
      dispatch(
        addNotification({
          userId: postUserId,
          notification: {
            id: `${postId}-like-${loggedInUserId}`,
            message: `${loggedInUserName} liked your post!`,
            userName: loggedInUserName,
          },
        })
      );
    }
  };

  const handleCommentSubmit = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setNewComment("");

    if (postUserId !== loggedInUserId) {
      dispatch(
        addNotification({
          userId: postUserId,
          notification: {
            id: `${postId}-comment-${loggedInUserId}`,
            message: `${loggedInUserName} commented on your post!`,
            userName: loggedInUserName,
          },
        })
      );
    }
  };
  const handleCommentDelete = async (userId, comment) => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, comment }),
      }
    );

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
      console.log("Comment deleted successfully");
    } else {
      console.error("Failed to delete comment");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      dispatch(removePost({ postId }));
      console.log("Post deleted successfully");
    } else {
      console.error("Failed to delete post");
    }
  };

  return (
    <div className="m-8 border border-gray-200 rounded-md p-4">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        showButton={!isProfile}
      />
      <p className="text-gray-800 mt-4">{description}</p>
      {picturePath && (
        <img
          className="mt-4 rounded-lg"
          style={{ maxWidth: "100%", height: "auto", borderRadius: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
          alt="Post"
        />
      )}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          <button onClick={patchLike} className="focus:outline-none">
            {isLiked ? (
              <AiFillHeart color="#FF0000" size={24} />
            ) : (
              <AiOutlineHeart size={24} />
            )}
          </button>
          <span className="text-gray-700">{likeCount}</span>
        </div>
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
        {loggedInUserId === postUserId && (
          <button
            onClick={handleDelete}
            className="ml-2 p-2 bg-red-500 text-white rounded-lg"
          >
            Delete
          </button>
        )}
      </div>

      {isComments && (
        <div className="mt-2">
          {comments.map((comment, i) => (
            <div
              key={`${comment.userId}-${i}`}
              className="flex items-center space-x-2"
            >
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              <p className="text-gray-700">
                <strong>
                  {comment.firstName} {comment.lastName}:
                </strong>{" "}
                {comment.comment}
              </p>
              {comment.userId === loggedInUserId && (
                <button
                  onClick={() =>
                    handleCommentDelete(comment.userId, comment.comment)
                  }
                  className="ml-2 p-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <div className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 flex-grow"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostWidget;
