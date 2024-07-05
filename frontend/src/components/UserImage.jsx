const UserImage = ({ image, size = "60px" }) => {
  return (
    <div className={`w-${size} h-${size} rounded-full overflow-hidden`}>
      <img
        className="w-full h-full object-cover"
        src={`http://localhost:3001/assets/${image}`}
        alt="user"
      />
    </div>
  );
};

export default UserImage;
