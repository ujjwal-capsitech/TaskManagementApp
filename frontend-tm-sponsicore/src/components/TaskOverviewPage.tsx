import React, { useState } from "react";
import {
  Drawer,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Select,
  Input,
  Divider,
  Form,
  message,
  DatePicker,
  Upload,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, userApi, projectApi } from "../Api/Api";
import { type User, type Project, type Task, mockActivityLogs } from "../Api/type";
import dayjs from "dayjs";
import Attachment2 from "../assets/Attachment2.svg";
import CurrentUserImage from "../assets/Current_User_image.svg";
import "../App.css";
import CustomTimeline from "./CustomTimeline";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface TaskOverviewPageProps {
  visible: boolean;
  onClose: () => void;
  taskId: string;
}

const TaskOverviewPage: React.FC<TaskOverviewPageProps> = ({
  visible,
  onClose,
  taskId,
}) => {
  const [activeTab, setActiveTab] = useState<"comment" | "activity">("comment");
  const [selectedMonth, setSelectedMonth] = useState("February");
  const [newComment, setNewComment] = useState("");
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch task data
  const { data: taskData, isLoading: isTaskLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskApi.getTask(taskId).then((res) => res.data.data),
    enabled: !!taskId && visible,
  });

  // Fetch users data
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getUsers().then((res) => res.data.data),
  });

  // Fetch projects data
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getProjects().then((res) => res.data.data),
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: (updatedTask: Partial<Task>) =>
      taskApi.updateTask(taskId, updatedTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      message.success("Task updated successfully");
    },
    onError: () => {
      message.error("Failed to update task");
    },
  });

  const handleUpdateTask = (values: any) => {
    const updatedTask: Partial<Task> = {
      taskTitle: values.title,
      description: values.description,
      dueDate: values.dueDate ? dayjs(values.dueDate).format("YYYY-MM-DD") : taskData?.dueDate,
      priority: values.priority,
      status: values.status,
      projectId: values.project,
    };
    updateTaskMutation.mutate(updatedTask);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    // In a real implementation, you would call an API to add the comment
    message.success("Comment added successfully");
    setNewComment("");
  };

  const getReporterName = (reporterId: string) => {
    const reporter = usersData?.find(user => user.userId === reporterId);
    return reporter?.name || "Unknown";
  };

  const getPriorityText = (priority: number) => {
    switch (priority) {
      case 2: return "High";
      case 1: return "Medium";
      case 0: return "Low";
      default: return "Unknown";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return "To do";
      case 1: return "In progress";
      case 2: return "NTD";
      case 3: return "Done";
      default: return "Unknown";
    }
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];



  // Mock attachments data
  const mockAttachments = [
    { name: "Project_document.pdf", size: "4.3Mb" },
    { name: "Project_brief.pdf", size: "2.1Mb" },
    { name: "Wireframe.pdf", size: "1.3Mb" },
  ];

  if (isTaskLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Drawer
      title={<Row gutter={16} align="middle">
        <Col span={12} style={{ borderRight: "1px solid #eee", }}>
          <span style={{ fontSize: "13px", color: "#464155" }}>
            Task Overview
          </span>
        </Col>
        <Col span={12}>
          <span style={{ fontSize: "13px", color: "#464155" }}>
            Task Log
          </span>
        </Col>
      </Row>
      }
      width={962}
      onClose={onClose}
      open={visible}
      bodyStyle={{ padding: "24px" }}
      headerStyle={{
        borderBottom: "1px solid #f0f0f0",
        padding: "16px 24px",
      }}
      footer={
        <Row gutter={16} justify="end" style={{ marginTop: "24px" }}>
          <Col>
            <Button
              onClick={onClose}
              style={{
                background: "#EEEFF4",
                width: "82px",
                height: "28px",
                fontSize: "13px",
                textAlign: "center",
                alignContent: "center",
                borderRadius: "4px",
                color: "#834666",
              }}
              size="large"
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => form.submit()}
              style={{
                width: "82px",
                height: "28px",
                background: "#01B075",
                fontSize: "13px",
                textAlign: "center",
                alignContent: "center",
                borderRadius: "4px",
              }}
              size="large"
              loading={updateTaskMutation.isPending}
            >
              Save
            </Button>
          </Col>
        </Row>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpdateTask}
        initialValues={{
          project: taskData?.projectId,
          title: taskData?.taskTitle,
          description: taskData?.description,
          dueDate: taskData?.dueDate ? dayjs(taskData.dueDate) : null,
          priority: taskData?.priority,
          status: taskData?.status,
        }}
      >
        <Row gutter={24}>
          {/* Left Column - Task Overview */}
          <Col span={12} style={{ paddingRight: "12px" }}>
            {/* Project Field */}
            <Row gutter={4} style={{ marginBottom: "16px", alignItems: "center" }}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Project</span>
              </Col>
              <Col span={19}>
                <Form.Item name="project" style={{ marginBottom: 0 }}>
                  <Select
                    style={{ fontSize: "13px", borderRadius: "4px", width: "100%" }}
                    size="small"
                  >
                    {projectsData?.map((project: Project) => (
                      <Option key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Title Field */}
            <Row gutter={16}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Title</span>
              </Col>
              <Col span={19}>
                <Form.Item name="title" style={{ marginBottom: 0 }}>
                  <Input
                    style={{ fontSize: "13px", borderRadius: "4px" }}
                    size="small"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Description Field */}
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Description</span>
              </Col>
              <Col span={19}>
                <Form.Item name="description" style={{ marginBottom: 0 }}>
                  <TextArea
                    rows={4}
                    style={{ fontSize: "13px", borderRadius: "4px" }}
                    size="small"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Due Date Field */}
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Due date</span>
              </Col>
              <Col span={12}>
                <Form.Item name="dueDate" style={{ marginBottom: 0 }}>
                  <DatePicker
                    style={{ width: "100%", fontSize: "13px", borderRadius: "4px" }}
                    placeholder="Select date"
                    size="small"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Priority Field */}
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Priority</span>
              </Col>
              <Col span={9}>
                <Form.Item name="priority" style={{ marginBottom: 0 }}>
                  <Select
                    style={{ fontSize: "13px", borderRadius: "4px", width: "100%" }}
                    size="small"
                  >
                    <Option value={2}>High</Option>
                    <Option value={1}>Medium</Option>
                    <Option value={0}>Low</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Status Field */}
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Status</span>
              </Col>
              <Col span={9}>
                <Form.Item name="status" style={{ marginBottom: 0 }}>
                  <Select
                    style={{ fontSize: "13px", borderRadius: "4px", width: "100%" }}
                    size="small"
                  >
                    <Option value={0}>To do</Option>
                    <Option value={1}>In progress</Option>
                    <Option value={2}>NTD</Option>
                    <Option value={3}>Done</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Assigned by Field */}
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Assigned by</span>
              </Col>
              <Col span={19}>
                <Text style={{ fontSize: "13px" }}>
                  {taskData?.reporterId ? getReporterName(taskData.reporterId) : "Unknown"}
                </Text>
              </Col>
            </Row>

            {/* Assignee Field */}
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Assignee</span>
              </Col>
              <Col span={19}>
                <Avatar.Group>
                  {taskData?.assigneeIds?.map((assigneeId, index) => {
                    const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068"];
                    const bgColor = colors[index % colors.length];
                    const user = usersData?.find(u => u.userId === assigneeId);
                    return (
                      <Avatar
                        key={assigneeId}
                        style={{
                          backgroundColor: bgColor,
                          fontSize: 12,
                          width: 28,
                          height: 28,
                          marginLeft: index === 0 ? 0 : -8,
                          border: "2px solid #fff",
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || assigneeId.charAt(0).toUpperCase()}
                      </Avatar>
                    );
                  })}
                </Avatar.Group>
              </Col>
            </Row>

            {/* Attachment Field */}
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={5} style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "8px" }}>
                <span style={{ fontSize: "13px", color: "#464155" }}>Attachment</span>
              </Col>
              <Col span={19}>
                <Row style={{ flexDirection: "column", gap: "8px" }}>
                  {mockAttachments.map((attachment, index) => (
                    <Col key={index}>
                      <Row align="middle" style={{ padding: "8px", border: "1px solid #f0f0f0", borderRadius: "4px" }}>
                        <Col span={2}>
                          <Avatar
                            shape="square"
                            src={Attachment2}
                            style={{ width: 24, height: 24 }}
                          />
                        </Col>
                        <Col span={18} style={{ paddingLeft: "8px" }}>
                          <Text style={{ fontSize: "12px", fontWeight: 500 }}>{attachment.name}</Text>
                          <br />
                          <Text style={{ fontSize: "11px", color: "#999" }}>Size: {attachment.size}</Text>
                        </Col>
                        <Col span={4} style={{ textAlign: "right" }}>
                          <Button type="text" size="small" style={{ padding: 0, minWidth: "auto" }}>
                            ×
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  ))}
                </Row>
                <Upload.Dragger
                  style={{
                    marginTop: "16px",
                    height: "100px",
                    padding: "16px",
                    fontSize: "13px"
                  }}
                >
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Upload.Dragger>
              </Col>
            </Row>
          </Col>

          {/* Right Column - Task Logs */}
          <Col span={12} style={{ paddingLeft: "12px", borderLeft: "1px solid #f0f0f0" }}>
            <Title level={5} style={{ fontSize: "14px", marginBottom: "16px" }}>
              Task Logs
            </Title>

            {/* Toggle and Month Selector */}
            <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }}>
              <Col
                style={{
                  background: "#F4F5FA",
                  width: "164px",
                  height: "32px",
                  padding: "2px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Button
                  size="small"
                  onClick={() => setActiveTab("comment")}
                  style={{
                    flex: 1,
                    fontSize: "13px",
                    border: "none",
                    boxShadow: "none",
                    backgroundColor: activeTab === "comment" ? "#FFFFFF" : "transparent",
                    color: activeTab === "comment" ? "#79435F" : "#000",
                    borderRadius: "4px",
                  }}
                >
                  Comment
                </Button>

                <Button
                  size="small"
                  onClick={() => setActiveTab("activity")}
                  style={{
                    flex: 1,
                    fontSize: "13px",
                    border: "none",
                    backgroundColor: activeTab === "activity" ? "#fff" : "transparent",
                    color: activeTab === "activity" ? "#79435F" : "#000",
                    borderRadius: "4px",
                  }}
                >
                  Activity
                </Button>
              </Col>

              <Col>
                <span style={{ fontSize: "13px", color: "#00000073", marginRight: "8px" }}>Month</span>
                <Select
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  style={{ fontSize: "13px", width: "118px", height: "28px" }}
                  size="small"
                >
                  {months.map(month => (
                    <Option key={month} value={month}>{month}</Option>
                  ))}
                </Select>
              </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            {/* Current User Avatar and Add Comment */}
            <Row align="middle" style={{ marginBottom: "16px" }}>
              <Col span={2}>
                <Avatar
                  src={CurrentUserImage}
                  size={32}
                  style={{ width: 32, height: 32, borderRadius: "100px", marginRight: "8px" }}
                />
              </Col>
              <Col span={22} style={{ paddingLeft: "8px" }}>
                <TextArea
                  placeholder="Autosize height based on content lines"
                  rows={4}
                  style={{ fontSize: "13px", borderRadius: "4px", width: "100%" }}
                  size="small"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Col>


            </Row>
            <Row justify="end">
              <Col style={{ display: "flex", justifyContent: "flex-end" }} >
                <Button
                  type="primary"
                  size="small"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  style={{
                    backgroundColor: "#01B075",
                    color: "#fff",
                    fontSize: "13px",
                    width: "128px",
                    height: "28px",
                    borderRadius: "4px",
                  }}
                >
                  Add Comment
                </Button>
              </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            {/* Comments/Activity List */}
            <Row style={{ flexDirection: "column" }}>
              {activeTab === "comment" ? (
                <CustomTimeline
                  data={mockActivityLogs}
                  type="comment"
                />
              ) : (
                <CustomTimeline
                  data={mockActivityLogs}
                  type="activity"
                />
              )}

              {activeTab === "activity" && (
                <Col style={{ marginBottom: "16px" }}>
                  <Text style={{ fontSize: "13px", color: "#999" }}>
                    Activity feed will appear here (status changes, assignee updates, etc.).
                  </Text>
                </Col>
              )}

              <Col style={{ marginBottom: "8px", marginTop: "16px" }}>
                <Text style={{ fontSize: "13px", fontWeight: 500 }}>Yesterday</Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default TaskOverviewPage;