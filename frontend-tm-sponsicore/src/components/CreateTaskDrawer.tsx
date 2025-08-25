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
  Divider,
} from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { taskApi, userApi, projectApi } from "../Api/Api";
import type { CreateTaskData, User, Project } from "../Api/type";
import Attachment from "../assets/Attachment.svg";

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
    mutationFn: (taskData: CreateTaskData) => taskApi.createTask(taskData),
    onSuccess: () => {
      form.resetFields();
      onClose();
    },
  });

  const handleSubmit = (values: any) => {
    const taskData: CreateTaskData = {
      taskTitle: values.title,
      description: values.description,
      dueDate: values.dueDate.format("YYYY-MM-DDTHH:mm:ssZ"),
      projectId: values.project,
      reporterId: "U-09", // Hardcoded based on your example
      assigneeIds: values.assignees,
      priority:
        values.priority === "High" ? 2 : values.priority === "Medium" ? 1 : 0,
    };
    createTaskMutation.mutate(taskData);
  };

  return (
    <Drawer
      title={
        <div>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: "16px",
              padding: "8px 0",
              borderBottom: "2px solid #52c41a", // Green line below title
            }}
          >
            Add Task
          </Title>
        </div>
      }
      width={720}
      onClose={onClose}
      open={visible}
      bodyStyle={{ padding: "24px" }}
      headerStyle={{ borderBottom: "1px solid #f0f0f0", padding: "16px 24px" }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Project Field */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="project"
              label={<span style={{ fontSize: "13px" }}>Project</span>}
              rules={[{ required: true, message: "Please select a project" }]}
            >
              <Select
                placeholder="Select project"
                style={{ fontSize: "13px" }}
                size="large"
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
        <Divider style={{ margin: "16px 0" }} />

        {/* Title Field */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label={<span style={{ fontSize: "13px" }}>Title</span>}
              rules={[{ required: true, message: "Please enter task title" }]}
            >
              <Input
                placeholder="Enter task title"
                style={{ fontSize: "13px" }}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: "16px 0" }} />

        {/* Reporter and Assignee Fields */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="reporter"
              label={<span style={{ fontSize: "13px" }}>Reporter</span>}
            >
              <Input
                defaultValue="Lucky"
                disabled
                style={{ fontSize: "13px" }}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="assignees"
              label={<span style={{ fontSize: "13px" }}>Assignee</span>}
              rules={[{ required: true, message: "Please select assignees" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select assignees"
                style={{ fontSize: "13px" }}
                size="large"
                allowClear
                showArrow
              >
                {usersData?.map((user: User) => (
                  <Option key={user.id} value={user.userId}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: "16px 0" }} />

        {/* Description Field */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="description"
              label={<span style={{ fontSize: "13px" }}>Description</span>}
            >
              <TextArea
                rows={4}
                placeholder="Autosize height based on content lines"
                style={{ fontSize: "13px" }}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: "16px 0" }} />

        {/* Priority and Due Date Fields */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="priority"
              label={<span style={{ fontSize: "13px" }}>Priority</span>}
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select
                placeholder="Select priority"
                style={{ fontSize: "13px" }}
                size="large"
              >
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dueDate"
              label={<span style={{ fontSize: "13px" }}>Due date</span>}
              rules={[{ required: true, message: "Please select due date" }]}
            >
              <DatePicker
                style={{ width: "100%", fontSize: "13px" }}
                placeholder="Select date"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: "16px 0" }} />

        {/* Attachment Field */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="attachment"
              label={<span style={{ fontSize: "13px" }}>Attachment</span>}
            >
              <Upload.Dragger
                name="file"
                multiple={false}
                beforeUpload={() => false}
                style={{ fontSize: "13px" }}
                listType="picture"
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: true,
                }}
              >
                <p className="ant-upload-drag-icon">
                  <img
                    src={Attachment}
                    alt="attachment"
                    style={{ width: "24px", height: "24px" }}
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
        <Row gutter={16} justify="end" style={{ marginTop: "24px" }}>
          <Col>
            <Button onClick={onClose} size="large">
              Cancel
            </Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" size="large">
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default CreateTaskDrawer;
