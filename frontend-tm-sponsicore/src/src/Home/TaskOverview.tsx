import React from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Avatar,
  Typography,
  Upload,
} from "antd";
import { UserOutlined, PaperClipOutlined } from "@ant-design/icons";
import type { Task, User, Project } from "../Api/type";
import AvatarGroup from "../components/Avatar";
import Attachment from "../assets/Attachment.svg";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface TaskOverviewProps {
  task: Task;
  users: User[];
  projects: Project[];
}

const TaskOverview: React.FC<TaskOverviewProps> = ({
  task,
  users,
  projects,
}) => {
  const getAssigneeUsers = () => {
    return users.filter((user) => task.assigneeIds.includes(user.userId));
  };

  const getReporterUser = () => {
    return users.find((user) => user.userId === task.reporterId);
  };

  return (
    <Form layout="vertical" disabled>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          {/* Project Field */}
          <Form.Item name="project" label="Project">
            <Select value={task.projectId}>
              {projects.map((project) => (
                <Option key={project.projectId} value={project.projectId}>
                  {project.projectName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Title Field */}
          <Form.Item name="title" label="Title">
            <Input value={task.taskTitle} />
          </Form.Item>

          {/* Description Field */}
          <Form.Item name="description" label="Description">
            <TextArea
              rows={4}
              value={task.description}
              placeholder="Autosize height based on content lines"
            />
          </Form.Item>

          {/* Priority Field */}
          <Form.Item name="priority" label="Priority">
            <Select value={task.priority}>
              <Option value={0}>Low</Option>
              <Option value={1}>Medium</Option>
              <Option value={2}>High</Option>
            </Select>
          </Form.Item>

          {/* Status Field */}
          <Form.Item name="status" label="Status">
            <Select value={task.status}>
              <Option value={0}>To do</Option>
              <Option value={1}>In progress</Option>
              <Option value={2}>NTD</Option>
              <Option value={3}>Done</Option>
            </Select>
          </Form.Item>

          {/* Assigned by Field */}
          <Form.Item label="Assigned by">
            <Text>{getReporterUser()?.name || "Unknown"}</Text>
          </Form.Item>

          {/* Assignee Field */}
          <Form.Item label="Assignee">
            <AvatarGroup users={getAssigneeUsers()} />
          </Form.Item>

          {/* Attachment Field */}
          <Form.Item label="Attachment">
            {task.attachments?.map((attachment, index) => (
              <div
                key={index}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PaperClipOutlined style={{ marginRight: 8 }} />
                <Text>
                  {attachment.name} Size: {attachment.size}
                </Text>
              </div>
            ))}
            <Upload.Dragger
              style={{
                height: "153.82px",
                width: "100%",
                backgroundColor: "#fff",
                border: "1px dashed #d9d9d9",
                borderRadius: "6px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                fontSize: "13px",
              }}
            >
              <p className="ant-upload-drag-icon">
                <img
                  src={Attachment}
                  alt="attachment"
                  style={{ width: "85.42px", height: "87.82px" }}
                />
              </p>
              <p
                className="ant-upload-text"
                style={{ fontSize: "13px", margin: "4px 0" }}
              >
                Click or drag file to this area to upload
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TaskOverview;
