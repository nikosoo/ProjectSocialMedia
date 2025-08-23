const UserImage = ({ userId, size }) => {
  return (
    <div>
      <img
        className="object-cover rounded-full"
        width={size}
        height={size}
        alt="user"
        src={`https://project-social-media-backend.vercel.app/users/${userId}/picture`}
      />
    </div>
  );
};

export default UserImage;
