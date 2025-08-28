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
          <Row gutter={16} align="middle" className="drawer-title-row">
            <Col span={12} className="drawer-title-col">
              <span className="drawer-title-text">Task Overview</span>
            </Col>
            <Col span={12} className="drawer-title-col">
              <span className="drawer-title-text">Task Log</span>
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
          <Row gutter={16} justify="end" className="footer-row">
            <Col>
              <Button
                onClick={onClose}
                className="cancel-button"
                size="large"
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => form.submit()}
                className="save-button"
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
            <Col span={12} className="left-column">
              {/* Project Field */}

              <Row
                gutter={4}
                className="form-row"
              >
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Project</span>
                </Col>

                <Col span={19}>
                  <Form.Item name="project" className="form-item">
                    <Select
                      className="form-select"
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
              <Row gutter={16} className="form-row">
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Title</span>
                </Col>
                <Col span={19}>
                  <Form.Item name="title" className="form-item">
                    <Input
                      className="form-input"
                      size="middle"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Description Field */}
              <Row gutter={16} className="form-row">
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Description</span>
                </Col>
                <Col span={19}>
                  <Form.Item name="description" className="form-item">
                    <Input.TextArea
                    maxLength={100}
                      rows={4}
                      className="form-textarea"
                      size="middle"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Due Date Field */}
              <Row gutter={16} className="form-row">
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Due date</span>
                </Col>
                <Col span={12}>
                  <Form.Item name="dueDate" className="form-item">
                    <DatePicker
                      className="form-datepicker"
                      placeholder="Select date"
                      size="middle"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Priority Field */}
              <Row gutter={16} className="form-row">
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Priority</span>
                </Col>
                <Col span={9}>
                  <Form.Item
                    name="priority"
                    rules={[
                      { required: true, message: "priority is required" }
                      
                    ]}
                    className="form-item"
                  >
                    <Select
                      className="form-select"
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
              <Row gutter={16} className="form-row">
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Status</span>
                </Col>
                <Col span={9}>
                  <Form.Item name="status" className="form-item">
                    <Select
                      className="form-select"
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
              <Row gutter={16} className="form-row">
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Assigned by</span>
                </Col>
                <Col span={19}>
                  <Text className="form-text">
                    {taskData?.reporter?.name || "Unknown"}
                  </Text>
                </Col>
              </Row>

              {/* Assignee Field */}
              <Row gutter={16} className="form-row">
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Assignee</span>
                </Col>
                <Col span={19}>
                  <Avatar.Group className="avatar-group">
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
                            className="assignee-avatar"
                            style={{ backgroundColor: bgColor }}
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
              <Row gutter={16} className="form-row">
                <Col
                  span={5}
                  className="form-label"
                >
                  <span>Attachment</span>
                </Col>
                <Col span={19}>
                  <Form.Item name="attachment" className="form-item">
                    <Upload.Dragger
                      className="custom-upload"
                      name="file"
                      multiple={true}
                      listType="text"
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <img
                          src={Attachment2}
                          alt="attachment"
                          className="attachment-image"
                        />
                      </p>
                      <p
                        className="ant-upload-text"
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
              className="right-column"
            >
              {/* Toggle and Month Selector */}
              <Row
                justify="space-between"
                align="middle"
                className="toggle-row"
              >
                <Col
                  className="toggle-group"
                >
                  <Button
                    size="middle"
                    onClick={() => setActiveTab("comment")}
                    className={`toggle-button ${activeTab === "comment" ? "active" : ""}`}
                  >
                    Comment
                  </Button>

                  <Button
                    size="middle"
                    onClick={() => setActiveTab("activity")}
                    className={`toggle-button ${activeTab === "activity" ? "active" : ""}`}
                  >
                    Activity
                  </Button>
                </Col>

                <Col>
                  <span
                    className="month-label"
                  >
                    Month
                  </span>
                  <Select
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    className="month-selector"
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

              <Divider className="divider" />

              {/* Current User Avatar and Add Comment */}
              {activeTab === "comment" && (
                <>
                  <Row align="middle" className="comment-row">
                    <Col span={2}>
                      <Avatar
                        src={CurrentUserImage}
                        size={32}
                        className="user-avatar"
                      />
                    </Col>
                    <Col span={22} className="comment-textarea-col">
                      <TextArea
                        placeholder="Autosize height based on content lines"
                        rows={4}
                        className="comment-textarea"
                        size="middle"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      />
                    </Col>
                  </Row>
                  <Row justify="end">
                    <Col
                      className="add-comment-button-col"
                    >
                      <Button
                        type="primary"
                        size="middle"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="add-comment-button"
                      >
                        Add Comment
                      </Button>
                    </Col>
                  </Row>
                  <Divider className="divider" />
                </>
              )}

              {/* Comments/Activity List */}
              <Row className="timeline-row">
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