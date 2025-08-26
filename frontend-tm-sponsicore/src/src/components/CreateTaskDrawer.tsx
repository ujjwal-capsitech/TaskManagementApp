
import React from "react";
import {
    Drawer,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Button,
    Row,
    Col,
    Typography,
} from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { taskApi, userApi, projectApi } from "../Api/Api";
import type {  User, Project, Task } from "../Api/type";
import Attachment from "../assets/Attachment.svg";
import "../App.css";

const { TextArea } = Input;
const { Title } = Typography;
const { Option } = Select;

interface CreateTaskDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const CreateTaskDrawer: React.FC<CreateTaskDrawerProps> = ({
    visible,
    onClose,
}) => {
    const [form] = Form.useForm();

    const { data: usersData } = useQuery({
        queryKey: ["users"],
        queryFn: () => userApi.getUsers().then((res) => res.data.data),
    });

    const { data: projectsData } = useQuery({
        queryKey: ["projects"],
        queryFn: () => projectApi.getProjects().then((res) => res.data.data),
    });
    
    const createTaskMutation = useMutation({
        mutationFn: (taskData: Task) => taskApi.createTask(taskData),
        onSuccess: () => {
            form.resetFields();
            onClose();
        },
    });

    const handleSubmit = (values: any) => {
        const taskData: Task = {
          ...values,
          taskTitle: values.title,
          description: values.description,
          dueDate: values.dueDate.format("YYYY-MM-DD"),
          projectId: values.project,
          reporterId: values.reporter,
          assigneeIds: values.assignees,
          priority:
            values.priority === "High"
              ? 0
              : values.priority === "Medium"
              ? 1
              : 2,
        };
        createTaskMutation.mutate(taskData);
    };

    return (
      <Drawer
        title={
          <Col>
            <Title
              level={4}
              style={{
                margin: 0,
                fontSize: "16px",
                // borderBottom: "2px solid #52c41a", // Green line below title
              }}
            >
              Add Task
            </Title>
          </Col>
        }
        width={481}
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
                htmlType="submit"
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
              >
                Save
              </Button>
            </Col>
          </Row>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
              <Form.Item
                name="project"
                style={{ marginBottom: 0 }}
                rules={[{ required: true, message: "Please select a project" }]}
              >
                <Select
                  placeholder="Select project"
                  style={{ fontSize: "13px", borderRadius: "4px" }}
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
            <Col
              span={5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                paddingLeft: "8px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#464155" }}>
                Reporter
              </span>
            </Col>
            <Col span={19}>
              <Form.Item
                name="title"
                rules={[{ required: true, message: "Please enter task title" }]}
              >
                <Input
                  placeholder="Enter task title"
                  style={{ fontSize: "13px", borderRadius: "4px" }}
                  size="small"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Reporter and Assignee Fields */}
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
                Reporter
              </span>
            </Col>
            <Col span={19}>
              <Form.Item name="reporter">
                <Select
                  placeholder="Select assignees"
                  style={{ fontSize: "13px", borderRadius: "4px" }}
                  size="small"
                  allowClear
                  showArrow
                >
                  {usersData?.map((user: User) => (
                    <Option key={user.userId} value={user.userId}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
                Assignee
              </span>
            </Col>
            <Col span={19}>
              <Form.Item
                name="assignees"
                rules={[{ required: true, message: "Please select assignees" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select assignees"
                  style={{ fontSize: "13px", borderRadius: "4px" }}
                  size="small"
                  allowClear
                  showArrow
                >
                  {usersData?.map((user: User) => (
                    <Option key={user.userId} value={user.userId}>
                      {user.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* Description Field */}
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
                Description
              </span>
            </Col>
            <Col span={19}>
              <Form.Item name="description">
                <TextArea
                  rows={4}
                  placeholder="Autosize height based on content lines"
                  style={{ fontSize: "13px", borderRadius: "4px" }}
                  size="small"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Priority and Due Date Fields */}
          <Row gutter={16}>
            <Col
              span={5}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                paddingLeft: "8px",
              }}
            >
              <span style={{ fontSize: "13px", color: "#464155" }}>Status</span>
            </Col>
            <Col span={9}>
              <Form.Item
                name="priority"
                rules={[{ required: true, message: "Please select priority" }]}
              >
                <Select
                  placeholder="Select priority"
                  style={{ fontSize: "13px", borderRadius: "4px" }}
                  size="small"
                >
                  <Option value="Inprogress">Inprogress</Option>
                  <Option value="Todo">Todo</Option>
                  <Option value="NTD">NTD</Option>
                  <Option value="Done">Done</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
                Priority
              </span>
            </Col>
            <Col span={9}>
              <Form.Item
                name="priority"
                rules={[{ required: true, message: "Please select priority" }]}
              >
                <Select
                  placeholder="Select priority"
                  style={{ fontSize: "13px", borderRadius: "4px" }}
                  size="small"
                >
                  <Option value="Inprogress">Inprogress</Option>
                  <Option value="Todo">Todo</Option>
                  <Option value="NTD">NTD</Option>
                  <Option value="Done">Done</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
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
                Due Date
              </span>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                rules={[{ required: true, message: "Please select due date" }]}
              >
                <DatePicker
                  style={{
                    width: "100%",
                    fontSize: "13px",
                    borderRadius: "4px",
                  }}
                  placeholder="Select date"
                  size="small"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Attachment Field */}
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
                Attachment
              </span>
            </Col>
            <Col span={19}>
              <Form.Item name="attachment">
                <Upload.Dragger
                  className="custom-upload"
                  name="file"
                  multiple={false}
                  beforeUpload={() => false}
                  listType="text"
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: true,
                  }}
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
          {/* Buttons */}
        </Form>
      </Drawer>
    );
};

export default CreateTaskDrawer;
