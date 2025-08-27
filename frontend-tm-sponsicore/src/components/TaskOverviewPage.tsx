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
import { type User, type Project, type Task, } from "../Api/type";
import dayjs from "dayjs";
import Attachment2 from "../assets/Attachment2.svg";
import CurrentUserImage from "../assets/Current_User_image.svg";
import "../App.css";
import CustomTimeline from "./CustomTimeline";
import { TaskStatus, Priority } from "../Api/type"
import { activityLogApi } from "../Api/Api";

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
    //Activity Log mutation
    const { data: activityLogsData } = useQuery({
        queryKey: ["activityLogs", taskId],
        queryFn: () => activityLogApi.getActivityLogs(taskId).then((res) => res.data.data),
        enabled: !!taskId && visible,
    });

    const validateName = (_: any, value: string) => {
      return value && value.trim() !== ""
        ? Promise.resolve()
        : Promise.reject();
    };
    const handleUpdateTask = (values: any) => {
        const updatedTask: Partial<Task> = {
            taskTitle: values.title,
            description: values.description,
            dueDate: values.dueDate ? dayjs(values.dueDate).format("YYYY-MM-DD") : taskData?.dueDate,
            priority: values.priority,
            status: values.status,
            project: values.project,
        };
        updateTaskMutation.mutate(updatedTask);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        // In a real implementation, you would call an API to add the comment
        message.success("Comment added successfully");
        setNewComment("");
    };

    

    const invert = (obj: Record<string, number>) =>
        Object.entries(obj).reduce((acc, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {} as Record<number, string>);

    const priorityLabels = invert(Priority);
    const taskStatusLabels = invert(TaskStatus);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    if (isTaskLoading) {
        return <Col>Loading...</Col>;
    }

    return (
      <Drawer
        title={
          <Row gutter={16} align="middle">
            <Col span={12} style={{ borderRight: "1px solid #eee" }}>
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
            project: taskData?.project?.projectId,
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

              <Row
                gutter={4}
                style={{ marginBottom: "16px", alignItems: "center" }}
              >
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Project
                  </span>
                </Col>

                <Col span={19}>
                  <Form.Item name="project" style={{ marginBottom: 0 }}>
                    <Select
                      style={{
                        fontSize: "13px",
                        borderRadius: "4px",
                        width: "100%",
                      }}
                      size="middle"
                      disabled
                    >
                      {projectsData?.map((project: Project) => (
                        <Option
                          key={project.projectId}
                          value={project.projectId}
                        >
                          {project.projectName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Title Field */}
              <Row gutter={16}>
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Title
                  </span>
                </Col>
                <Col span={19}>
                  <Form.Item name="title" style={{ marginBottom: 0 }}>
                    <Input
                      style={{ fontSize: "13px", borderRadius: "4px" }}
                      size="middle"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Description Field */}
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Description
                  </span>
                </Col>
                <Col span={19}>
                  <Form.Item name="description" style={{ marginBottom: 0 }}>
                    <Input.TextArea
                    maxLength={100}
                      rows={4}
                      style={{ fontSize: "13px", borderRadius: "4px" }}
                      size="middle"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Due Date Field */}
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Due date
                  </span>
                </Col>
                <Col span={12}>
                  <Form.Item name="dueDate" style={{ marginBottom: 0 }}>
                    <DatePicker
                      style={{
                        width: "100%",
                        fontSize: "13px",
                        borderRadius: "4px",
                      }}
                      placeholder="Select date"
                      size="middle"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Priority Field */}
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Priority
                  </span>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name="priority"
                    rules={[
                      { required: true, message: "priority is required" }
                      
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      style={{
                        fontSize: "13px",
                        borderRadius: "4px",
                        width: "100%",
                      }}
                      size="middle"
                    >
                      {Object.values(Priority).map((value) => (
                        <Option key={value} value={value}>
                          {priorityLabels[value]}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Status Field */}
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Status
                  </span>
                </Col>
                <Col span={9}>
                  <Form.Item name="status" style={{ marginBottom: 0 }}>
                    <Select
                      style={{
                        fontSize: "13px",
                        borderRadius: "4px",
                        width: "100%",
                      }}
                      size="middle"
                    >
                      {Object.values(TaskStatus).map((value) => (
                        <Option key={value} value={value}>
                          {taskStatusLabels[value]}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Assigned by Field */}
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Assigned by
                  </span>
                </Col>
                <Col span={19}>
                  <Text style={{ fontSize: "13px" }}>
                    {taskData?.reporter?.name || "Unknown"}
                  </Text>
                </Col>
              </Row>

              {/* Assignee Field */}
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Assignee
                  </span>
                </Col>
                <Col span={19}>
                  <Avatar.Group>
                    {taskData?.assignees?.map(
                      (assignee: any, index: number) => {
                        const colors = [
                          "#f56a00",
                          "#7265e6",
                          "#ffbf00",
                          "#00a2ae",
                          "#87d068",
                        ];
                        const bgColor = colors[index % colors.length];
                        return (
                          <Avatar
                            key={assignee.assigneeId}
                            style={{
                              backgroundColor: bgColor,
                              fontSize: 12,
                              width: 28,
                              height: 28,
                              marginLeft: index === 0 ? 0 : -8,
                              border: "2px solid #fff",
                            }}
                          >
                            {assignee.name?.charAt(0).toUpperCase()}
                          </Avatar>
                        );
                      }
                    )}
                  </Avatar.Group>
                </Col>
              </Row>

              {/* Attachment Field */}
              <Row gutter={16} style={{ marginTop: "16px" }}>
                <Col
                  span={5}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    paddingLeft: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#464155" }}>
                    Attachment
                  </span>
                </Col>
                <Col span={19}>
                  <Form.Item name="attachment", label="attachment">
                    <Upload.Dragger
                      className="custom-upload"
                      name="file"
                      multiple={true}
                      listType="text"
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                      }}
                      style={{
                        height: "153.82px",
                        width: "100%",
                        backgroundColor: "#ffffff",
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
                          src={Attachment2}
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
            </Col>

            {/* Right Column - Task Logs */}
            <Col
              span={12}
              style={{ paddingLeft: "12px", borderLeft: "1px solid #f0f0f0" }}
            >
              {/* <Title
                level={5}
                style={{ fontSize: "14px", marginBottom: "16px" }}
              >
                Task Logs
              </Title> */}

              {/* Toggle and Month Selector */}
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: "16px" }}
              >
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
                    size="middle"
                    onClick={() => setActiveTab("comment")}
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      border: "none",
                      boxShadow: "none",
                      backgroundColor:
                        activeTab === "comment" ? "#FFFFFF" : "transparent",
                      color: activeTab === "comment" ? "#79435F" : "#000",
                      borderRadius: "4px",
                    }}
                  >
                    Comment
                  </Button>

                  <Button
                    size="middle"
                    onClick={() => setActiveTab("activity")}
                    style={{
                      flex: 1,
                      fontSize: "13px",
                      border: "none",
                      backgroundColor:
                        activeTab === "activity" ? "#fff" : "transparent",
                      color: activeTab === "activity" ? "#79435F" : "#000",
                      borderRadius: "4px",
                    }}
                  >
                    Activity
                  </Button>
                </Col>

                <Col>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#00000073",
                      marginRight: "8px",
                    }}
                  >
                    Month
                  </span>
                  <Select
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    style={{ fontSize: "13px", width: "118px", height: "28px" }}
                    size="middle"
                  >
                    {months.map((month) => (
                      <Option key={month} value={month}>
                        {month}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Divider style={{ margin: "16px 0" }} />

              {/* Current User Avatar and Add Comment */}
              {activeTab === "comment" && (
                <>
                  <Row align="middle" style={{ marginBottom: "16px" }}>
                    <Col span={2}>
                      <Avatar
                        src={CurrentUserImage}
                        size={32}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "100px",
                          marginRight: "8px",
                        }}
                      />
                    </Col>
                    <Col span={22} style={{ paddingLeft: "8px" }}>
                      <TextArea
                        placeholder="Autosize height based on content lines"
                        rows={4}
                        style={{
                          fontSize: "13px",
                          borderRadius: "4px",
                          width: "100%",
                        }}
                        size="middle"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row justify="end">
                    <Col
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        type="primary"
                        size="middle"
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
                </>
              )}

              {/* Comments/Activity List */}
              <Row style={{ flexDirection: "column" }}>
                {activeTab === "comment" ? (
                  <CustomTimeline
                    data={activityLogsData || []}
                    type={activeTab}
                    taskId={taskId}
                  />
                ) : (
                  <CustomTimeline
                    data={activityLogsData || []}
                    type={activeTab}
                    taskId={taskId}
                  />
                )}
              </Row>
            </Col>
          </Row>
        </Form>
      </Drawer>
    );
};

export default TaskOverviewPage;