import React, { useEffect, useState } from "react";
import axios from "axios";
import UserListPopup from "./userLIstPopUp.jsx"; // Import the Popup component

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFollowersPopup, setShowFollowersPopup] = useState(false);
  const [showFollowedPopup, setShowFollowedPopup] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/6713992edb59710789e3b7ea");
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFollowersClick = () => {
    setShowFollowersPopup(true);
  };

  const handleFollowedClick = () => {
    setShowFollowedPopup(true);
  };

  const closePopup = () => {
    setShowFollowersPopup(false);
    setShowFollowedPopup(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Age:</strong> {user.age}
      </p>
      <p>
        <strong>Gender:</strong> {user.gender}
      </p>
      <p>
        <strong>Bio:</strong> {user.bio}
      </p>
      <p>
        <strong>Login Name:</strong> {user.loginName}
      </p>
      <p>
        <strong>Preferences:</strong> {user.preference.join(", ")}
      </p>
      <p>
        <strong>Followed Users:</strong>
        <span onClick={handleFollowedClick} style={{ cursor: "pointer" }}>
          {user.followedUsers.length}
        </span>
      </p>
      <p>
        <strong>Followers:</strong>
        <span onClick={handleFollowersClick} style={{ cursor: "pointer" }}>
          {user.followers.length}
        </span>
      </p>

      {showFollowersPopup && (
        <User ListPopup userIds={user.followers} onClose={closePopup} />
      )}
      {showFollowedPopup && (
        <User ListPopup userIds={user.followedUsers} on Close={closePopup} />
      )}
    </div>
  );
};

export default UserProfile;
