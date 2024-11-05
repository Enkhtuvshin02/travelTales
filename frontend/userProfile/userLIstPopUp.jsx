import React, { useEffect, useState } from "react";
import axios from "axios";

const UserListPopup = ({ userIds, onClose }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post("/api/users", { ids: userIds });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userIds]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="popup">
      <button onClick={onClose}>Close</button>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong> (Age: {user.age}, Gender: {user.gender}
            )
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserListPopup;
