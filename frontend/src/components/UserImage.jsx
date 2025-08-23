const UserImage = ({ userId, size }) => {
  return (
    <div>
      <img
        className="object-cover rounded-full"
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3000/users/${userId}/picture`}
      />
    </div>
  );
};

export default UserImage;
