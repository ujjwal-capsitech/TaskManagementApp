import React from "react";
import { Avatar } from "antd";
import type { User } from "../Api/type";

interface AvatarGroupProps {
  users: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users }) => {
  const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068"];

  return (
    <Avatar.Group maxCount={3}>
      {users.map((user, index) => {
        const bgColor = colors[index % colors.length];
        return (
          <Avatar
            key={user.userId}
            style={{
              backgroundColor: bgColor,
              fontSize: 12,
              width: 28,
              height: 28,
              marginLeft: index === 0 ? 0 : -8,
              border: "2px solid #fff",
              zIndex: users.length - index,
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
        );
      })}
    </Avatar.Group>
  );
};

export default AvatarGroup;
