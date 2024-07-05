const UserImage = ({ image, size = "60px" }) => {
  return (
    <div className={`w-${size} h-${size}`}>
      <img
        className="object-cover rounded-full"
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}
      />
    </div>
  );
};

export default UserImage;
