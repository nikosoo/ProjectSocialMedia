import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, removePost, addNotification } from "../../state";
import Friend from "../../components/Friend";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { MdComment } from "react-icons/md";

const PostWidget = ({ post, isProfile }) => {
  const [isComments, setIsComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user?._id);
  const loggedInUserName = `${useSelector((state) => state.user?.firstName)} ${useSelector(
    (state) => state.user?.lastName
  )}`;

  const isLiked = Boolean(post.likes[loggedInUserId]);
  const likeCount = Object.keys(post.likes).length;

  /* LIKE POST */
  const patchLike = async () => {
    const response = await fetch(`https://project-social-media-backend.vercel.app/posts/${post._id}/like`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));

    if (post.userId !== loggedInUserId) {
      dispatch(
        addNotification({
          userId: post.userId,
          notification: {
            id: `${post._id}-like-${loggedInUserId}`,
            message: `${loggedInUserName} liked your post!`,
            userName: loggedInUserName,
          },
        })
      );
    }
  };

  /* ADD COMMENT */
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    const response = await fetch(`https://project-social-media-backend.vercel.app/posts/${post._id}/comment`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ userId: loggedInUserId, comment: newComment }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setNewComment("");
  };

  /* DELETE COMMENT */
  const handleCommentDelete = async (userId, comment) => {
    const response = await fetch(`https://project-social-media-backend.vercel.app/posts/${post._id}/comment`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ userId, comment }),
    });

    if (response.ok) {
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    }
  };

  /* DELETE POST */
  const handleDelete = async () => {
    const response = await fetch(`https://project-social-media-backend.vercel.app/posts/${post._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    if (response.ok) dispatch(removePost({ postId: post._id }));
  };

  /* Helper: Convert MongoDB Buffer → Base64 */
  const getImageSrc = (picture) => {
    if (!picture?.data) return null;
    return `data:${picture.contentType};base64,${btoa(
      new Uint8Array(picture.data.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )}`;
  };

  return (
    <div className="m-8 bg-purple-50 p-4 rounded-lg shadow-lg">
      <Friend
        friendId={post.userId}
        name={`${post.firstName} ${post.lastName}`}
        subtitle={post.location}
        showButton={!isProfile}
      />

      <p className="text-gray-800 mt-4 text-lg">{post.description}</p>

      {/* Render image from MongoDB */}
      {getImageSrc(post.picture) && (
        <img
          className="mt-4 rounded-lg"
          style={{ maxWidth: "100%", height: "auto" }}
          src={getImageSrc(post.picture)}
          alt="Post"
        />
      )}

      {/* Likes / Comments / Delete */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <button onClick={patchLike} className="focus:outline-none">
            {isLiked ? <AiFillHeart color="#D53F8C" size={24} /> : <AiOutlineHeart size={24} />}
          </button>
          <span className="text-gray-700 text-sm">{likeCount}</span>
        </div>
        <button
          onClick={() => setIsComments(!isComments)}
          className="flex items-center space-x-1 focus:outline-none"
        >
          <MdComment size={24} className="text-gray-600" />
          <span className="text-gray-700 text-sm">{post.comments.length}</span>
        </button>
        {loggedInUserId === post.userId && (
          <button
            onClick={handleDelete}
            className="ml-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
          >
            <FaTrashAlt size={16} />
          </button>
        )}
      </div>

      {/* Comments section */}
      {isComments && (
        <div className="mt-4">
          {post.comments.map((comment, i) => (
            <div key={`${comment.userId}-${i}`} className="flex items-start mb-2 space-x-4">
              <div className="flex-grow">
                <p className="text-gray-700">
                  <strong>
                    {comment.firstName} {comment.lastName}:
                  </strong>{" "}
                  {comment.comment}
                </p>
              </div>
              {comment.userId === loggedInUserId && (
                <button
                  onClick={() => handleCommentDelete(comment.userId, comment.comment)}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
                >
                  <FaTrashAlt size={14} />
                </button>
              )}
            </div>
          ))}

          {/* Add new comment */}
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="text"
              className="border border-gray-300 rounded-lg p-2 flex-grow focus:ring-2 focus:ring-purple-300"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-purple-500 text-white p-2 rounded-lg"
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
