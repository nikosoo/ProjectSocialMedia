const UserImage = ({ image, size }) => {
  return (
    <div>
      <img
        className="object-cover rounded-full"
        width={size}
        height={size}
        alt="user"
        src={`https://project-social-media-backend.vercel.app/assets/${image}`}
      />
    </div>
  );
};

export default UserImage;
