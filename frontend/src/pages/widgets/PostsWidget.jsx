import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3000/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error(error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:3000/posts/${userId}/posts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isProfile) getUserPosts();
    else getPosts();
  }, [isProfile, userId, token]);

  if (!Array.isArray(posts)) return <p>Loading posts...</p>;

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-4">
      {sortedPosts.length === 0 ? (
        <p>No posts available.</p>
      ) : (
        sortedPosts.map((post) => (
          <PostWidget key={post._id} post={post} isProfile={isProfile} />
        ))
      )}
    </div>
  );
};

export default PostsWidget;
