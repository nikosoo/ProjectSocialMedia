import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state";
import UserImage from "../../components/UserImage";
import Dropzone from "react-dropzone";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const MyPostWidget = () => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [post, setPost] = useState("");
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
    }

    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const posts = await response.json();
    dispatch(setPosts({ posts }));

    // reset input
    setImage(null);
    setPost("");
    setIsImage(false);
    setError("");
  };

  const handleImageDrop = (acceptedFiles, rejectedFiles) => {
  if (rejectedFiles.length > 0) {
    setError("File too large! Max size is 5MB.");
    return;
  }
  if (acceptedFiles[0]) {
    const file = acceptedFiles[0];

    // Custom warning if file > 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError("⚠️ This image is larger than 2MB, consider using a smaller one.");
    } else {
      setError(""); // clear warning
    }

    setImage(file);
  }
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* User profile image + input */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <UserImage userId={user._id} size="60px" />

        <input
          type="text"
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          className="w-full bg-purple-100 rounded-full px-4 py-2 outline-none focus:bg-purple-200 transition-colors"
        />
      </div>

      {/* Image upload */}
      {isImage && (
        <div className="border border-purple-300 rounded-lg p-4 mb-4">
          <Dropzone
            accept={{ "image/jpeg": [], "image/png": [] }}
            multiple={false}
            maxSize={MAX_FILE_SIZE}
            onDrop={handleImageDrop}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="border-2 border-purple-500 p-4 w-full cursor-pointer hover:bg-purple-100 transition-colors"
              >
                <input {...getInputProps()} />
                {!image ? (
                  <p>Add Image Here</p>
                ) : (
                  <div className="flex justify-between items-center">
                    <p>{image.name}</p>
                    <button onClick={() => setImage(null)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}

      <hr className="my-5 border-purple-300" />

      {/* Action buttons */}
      <div className="flex justify-between items-center">
        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={() => setIsImage(!isImage)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16 18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2h2a2 2 0 0 1 2 2v10zM6 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
            />
          </svg>
          <p className="text-purple-600 hover:text-purple-800 transition-colors">
            Image
          </p>
        </div>

        <button
          onClick={handlePost}
          disabled={!post}
          className="px-6 py-3 bg-purple-500 text-white rounded-full disabled:opacity-50 hover:bg-purple-600 transition-colors"
        >
          POST
        </button>
      </div>
    </div>
  );
};

export default MyPostWidget;
