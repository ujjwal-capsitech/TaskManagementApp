import React from "react";
import { Row, Col, Avatar, Typography } from "antd";
import type { Comment as CommentType ,Task} from "../Api/type";

const { Text } = Typography;

interface CommentProps {
  comment: CommentType;
  task: Task;
}

const Comment: React.FC<CommentProps> = ({ comment }) => {
  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col>
        <Avatar>{comment.name.charAt(0).toUpperCase()}</Avatar>
      </Col>
      <Col flex="auto">
        <Row justify="space-between">
          <Col>
            <Text strong>{comment.name}</Text>
            <Text> added a comment on {Task.taskTitle}</Text>
          </Col>
          <Col>
            <Text type="secondary">
              {new Date(comment.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </Col>
        </Row>
        <Text>{comment.content}</Text>
      </Col>
    </Row>
  );
};

export default Comment;
