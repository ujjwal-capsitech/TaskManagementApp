import React, { useState } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Avatar,
  Typography,
  Input,
  Select,
  Space,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { taskApi, projectApi } from "../Api/Api";
import type { Project, Task } from "../Api/type";
import CreateTaskDrawer from "../components/CreateTaskDrawer";
import TaskOverviewPage from "../components/TaskOverviewPage";
import { TaskStatus, Priority } from "../Api/type";

// Priority Images
import HighPriority from "../assets/High_Priority.svg";
import LowPriority from "../assets/Low_Priority.svg";
import NormalPriority from "../assets/Nornal_Priority.svg";
import "../App.css";
import dayjs from "dayjs";

const { Text } = Typography;

const TaskPage: React.FC = () => {
  const [createTaskDrawerVisible, setCreateTaskDrawerVisible] = useState(false);
  const [taskOverviewVisible, setTaskOverviewVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getTasks().then((res) => res.data.data),
  });
  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getProjects().then((res) => res.data.data),
  });

  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 2:
        return (
          <img
            src={HighPriority}
            alt="high"
            style={{ width: 16, marginRight: 6 }}
          />
        );
      case 1:
        return (
          <img
            src={NormalPriority}
            alt="normal"
            style={{ width: 16, marginRight: 6 }}
          />
        );
      case 0:
        return (
          <img
            src={LowPriority}
            alt="low"
            style={{ width: 16, marginRight: 6 }}
          />
        );
      default:
        return null;
    }
  };

  const handleTaskIdClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setTaskOverviewVisible(true);
  };
  const invert = (obj: Record<string, number>) =>
    Object.entries(obj).reduce((acc, [key, value]) => {
      acc[value] = key;
      return acc;
    }, {} as Record<number, string>);

  const taskStatusLabels = invert(TaskStatus);
  const priorityLabels = invert(Priority);
  const columns: ColumnsType<Task> = [
    {
      title: "Project",
      dataIndex: "projectName",
      key: "projectName",
      render: (_, record) => (
        <Text>{record.project?.projectName || "N/A"}</Text>
      ),
    },
    {
      title: "Task Id",
      dataIndex: "taskId",
      key: "taskId",
      render: (id, record) => (
        <Button
          type="link"
          className="custom-link-button"
          style={{ padding: 0, color: "#834666" }}
          onClick={() => handleTaskIdClick(record.taskId)}
        >
          {id}
        </Button>
      ),
    },
    {
      title: "Title",
      dataIndex: "taskTitle",
      key: "taskTitle",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Assigned by",
      dataIndex: "reporterId",
      key: "reporter",
      render: (_, record) => <Text>{record.reporter?.name||"N/A"}</Text>,
    },
    {
      title: "Assignee's",
      key: "assignees",
      render: (_, record) => (
        <Avatar.Group>
          {record.assignees?.map((assignee: any, index: number) => {
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
                  zIndex: record.assignees.length - index,
                }}
              >
                {assignee.name.charAt(0).toUpperCase()}
              </Avatar>
            );
          })}
        </Avatar.Group>
      ),
    },

    {
      title: "Assigned date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD MM YYYY"),
    },
    {
      title: "Due date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => dayjs(date).format("DD MM YYYY"),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: number) => (
        <Row align="middle">
          {getPriorityIcon(priority)}
          <Text>
            {priority === 2 ? "High" : priority === 1 ? "Medium" : "Low"}
          </Text>
        </Row>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <Select
          style={{ width: "118px", height: "28px" }}
          defaultValue={status}
          placeholder="Select Status"
        >
          {Object.values(TaskStatus).map((value) => (
            <Select.Option key={value} value={value}>
              {taskStatusLabels[value]}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{ margin: "8px  8px", padding: "8px" }}
      >
        <Col>
          <Button
            type="primary"
            style={{ backgroundColor: "#01B075" }}
            onClick={() => setCreateTaskDrawerVisible(true)}
          >
            + Task
          </Button>
        </Col>
        <Space>
          <Col>
            <Select
              placeholder="Priority"
              style={{
                fontSize: "13px",
                borderRadius: "4px",
                height: "28px",
                width: "242px",
              }}
              size="middle"
            >
              {Object.values(Priority).map((value) => (
                <Select.Option key={value} value={value}>
                  {priorityLabels[value]}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Select
              placeholder="Project"
              style={{
                fontSize: "13px",
                borderRadius: "4px",
                height: "28px",
                width: "242px",
              }}
              size="middle"
            >
              {projectsData?.map((project: Project) => (
                <Select.Option
                  key={project.projectId}
                  value={project.projectId}
                >
                  {project.projectName}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Input.Search
              placeholder="Search"
              allowClear
              style={{
                fontSize: "13px",
                borderRadius: "4px",
                height: "28px",
                width: "242px",
              }}
              size="middle"
            />
          </Col>
        </Space>
      </Row>

      <Row>
        <Col span={24}>
          <Table
            rowKey="id"
            loading={isLoading}
            columns={columns}
            dataSource={tasksData || []}
            pagination={false}
            style={{ overflowX: "auto", padding: "8px" }}
          />
        </Col>
      </Row>

      <CreateTaskDrawer
        visible={createTaskDrawerVisible}
        onClose={() => setCreateTaskDrawerVisible(false)}
      />

      {selectedTaskId && (
        <TaskOverviewPage
          visible={taskOverviewVisible}
          onClose={() => {
            setTaskOverviewVisible(false);
            setSelectedTaskId(null);
          }}
          taskId={selectedTaskId}
        />
      )}
    </>
  );
};

export default TaskPage;
