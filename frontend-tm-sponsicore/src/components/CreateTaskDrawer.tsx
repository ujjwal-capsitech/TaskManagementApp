import React, { useState } from "react";
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
  message,
} from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { taskApi, userApi, projectApi } from "../Api/Api";
import type { User, Project } from "../Api/type";
import Attachment from "../assets/Attachment.svg";
import "../App.css";
import { TaskStatus, Priority } from "../Api/type";

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
  const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getUsers().then((res) => res.data.data),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getProjects().then((res) => res.data.data),
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData: any) => taskApi.createTask(taskData),
    onSuccess: () => {
      form.resetFields();
      setAttachmentBase64(null);
      setFileList([]);
      onClose();
      message.success("Task created successfully");
    },
    onError: (error: any) => {
      message.error(`Failed to create task: ${error.message}`);
    },
  });

  // ✅ Handle image upload
  const handleImageUpload = (file: File) => {
    if (!file.type.match("image/jpeg")) {
      message.error("Please select a JPEG image");
      return Upload.LIST_IGNORE;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64Data = `data:${file.type};base64,${btoa(
          new Uint8Array(event.target.result as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`;
        setAttachmentBase64(base64Data);
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: base64Data,
          },
        ]);
        message.success("Image uploaded successfully");
      }
    };
    reader.readAsArrayBuffer(file);

    return false; // prevent auto-upload
  };

  // ✅ Submit handler
  const handleSubmit = async (values: any) => {
    try {
      const taskData = {
        taskTitle: values.title,
        description: values.description,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        projectId: values.project,
        reporterId: values.reporter,
        assigneeIds: values.assignees,
        priority: values.priority,
        status: values.status || TaskStatus.Todo,
        attachments: attachmentBase64
          ? [
              {
                name: fileList[0]?.name || "attachment.jpg",
                size: `${Math.round(attachmentBase64.length / 1024)} KB`,
                url: attachmentBase64,
              },
            ]
          : [],
      };

      await createTaskMutation.mutateAsync(taskData);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Helper to invert enums for labels
  const invert = (obj: Record<string, number>) =>
    Object.entries(obj).reduce((acc, [key, value]) => {
      acc[value] = key;
      return acc;
    }, {} as Record<number, string>);

  const priorityLabels = invert(Priority);
  const taskStatusLabels = invert(TaskStatus);

  return (
    <Drawer
      title={
        <Col>
          <Title level={4} className="drawer-header-title">
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
              loading={createTaskMutation.isLoading}
            >
              Save
            </Button>
          </Col>
        </Row>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Project */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Project</span>
          </Col>
          <Col span={19}>
            <Form.Item
              name="project"
              rules={[{ required: true, message: "Please select a project" }]}
              className="form-item"
            >
              <Select placeholder="Project" size="middle" className="form-select">
                {projectsData?.map((project: Project) => (
                  <Option key={project.projectId} value={project.projectId}>
                    {project.projectName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Title */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Title</span>
          </Col>
          <Col span={19}>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Please enter task title" }]}
              className="form-item"
            >
              <Input placeholder="Enter task title" size="small" className="form-input" />
            </Form.Item>
          </Col>
        </Row>

        {/* Reporter */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Reporter</span>
          </Col>
          <Col span={19}>
            <Form.Item
              name="reporter"
              rules={[{ required: true, message: "Please select a reporter" }]}
              className="form-item"
            >
              <Select placeholder="Select reporter" size="small" className="form-select">
                {usersData?.map((user: User) => (
                  <Option key={user.userId} value={user.userId}>
                    {user.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Assignees */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Assignees</span>
          </Col>
          <Col span={19}>
            <Form.Item
              name="assignees"
              rules={[{ required: true, message: "Please select assignees" }]}
              className="form-item"
            >
              <Select
                mode="multiple"
                placeholder="Select assignees"
                size="small"
                className="form-select"
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

        {/* Description */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Description</span>
          </Col>
          <Col span={19}>
            <Form.Item name="description" className="form-item">
              <TextArea rows={4} placeholder="Enter description" size="small" className="form-textarea" />
            </Form.Item>
          </Col>
        </Row>

        {/* Priority */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Priority</span>
          </Col>
          <Col span={9}>
            <Form.Item
              name="priority"
              rules={[{ required: true, message: "Please select priority" }]}
              className="form-item"
            >
              <Select placeholder="Select priority" size="small" className="form-select">
                {Object.values(Priority).map((value) => (
                  <Option key={value} value={value}>
                    {priorityLabels[value]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Status */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Status</span>
          </Col>
          <Col span={9}>
            <Form.Item name="status" className="form-item">
              <Select placeholder="Select status" size="small" className="form-select">
                {Object.values(TaskStatus).map((value) => (
                  <Option key={value} value={value}>
                    {taskStatusLabels[value]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Due Date */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Due Date</span>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dueDate"
              rules={[{ required: true, message: "Please select due date" }]}
              className="form-item"
            >
              <DatePicker
                className="form-datepicker"
                placeholder="Select date"
                size="small"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Attachment */}
        <Row gutter={16} className="form-row">
          <Col span={5} className="form-label">
            <span>Attachment</span>
          </Col>
          <Col span={19}>
            <Form.Item name="attachment" className="form-item">
              <Upload.Dragger
                className="custom-upload"
                multiple={false}
                beforeUpload={handleImageUpload}
                fileList={fileList}
                onRemove={() => {
                  setAttachmentBase64(null);
                  setFileList([]);
                }}
                listType="picture"
              >
                <p className="ant-upload-drag-icon">
                  <img
                    src={Attachment}
                    alt="attachment"
                    className="attachment-image"
                  />
                </p>
                <p className="ant-upload-text">
                  {attachmentBase64
                    ? "Image uploaded successfully"
                    : "Click or drag file to upload"}
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default CreateTaskDrawer;