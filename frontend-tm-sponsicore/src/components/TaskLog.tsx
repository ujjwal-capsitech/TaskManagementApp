import React, { useState } from "react";
import { Row, Col, Select, Button, Avatar, Input, Divider, Tabs } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CommentSection from "./CommentSection";
import ActivityLog from "./TaskActivityLog";

const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface TaskLogProps {
  taskId: string;
}

const TaskLog: React.FC<TaskLogProps> = ({ taskId }) => {
  const [activeTab, setActiveTab] = useState("comments");
  const [selectedMonth, setSelectedMonth] = useState("February");
  const [newComment, setNewComment] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      console.log("Adding comment:", newComment);
      setNewComment("");
    }
  };

  return (
    <Row>
      <Col span={24}>
        {/* Toggle and Month Selector */}
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane tab="Comment" key="comments" />
              <TabPane tab="Activity" key="activities" />
            </Tabs>
          </Col>
          <Col>
            <Select
              value={selectedMonth}
              onChange={setSelectedMonth}
              style={{ width: 120 }}
            >
              {months.map((month) => (
                <Option key={month} value={month}>
                  {month}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Divider />

        {/* Comment Input */}
        <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Avatar
              icon={<UserOutlined />}
              style={{
                width: 32,
                height: 32,
                borderRadius: "100px",
              }}
            />
          </Col>
          <Col flex="auto">
            <TextArea
              rows={2}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={handleAddComment}>
              Post
            </Button>
          </Col>
        </Row>

        <Divider />

        {/* Comments or Activities */}
        {activeTab === "comments" ? (
          <CommentSection taskId={taskId} />
        ) : (
          <ActivityLog />
        )}
      </Col>
    </Row>
  );
};

export default TaskLog;
