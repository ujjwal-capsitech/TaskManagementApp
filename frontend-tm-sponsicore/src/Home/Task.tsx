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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../Api/Api";
import type { Task } from "../Api/type";
import CreateTaskDrawer from "../components/CreateTaskDrawer";
import TaskOverviewPage from "../components/TaskOverviewPage";

// Priority Images
import HighPriority from "../assets/High_Priority.svg";
import LowPriority from "../assets/Low_Priority.svg";
import NormalPriority from "../assets/Nornal_Priority.svg";
import "../App.css";
const { Text } = Typography;

const TaskPage: React.FC = () => {
  const [createTaskDrawerVisible, setCreateTaskDrawerVisible] = useState(false);
  const [taskOverviewVisible, setTaskOverviewVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => taskApi.getTasks().then((res) => res.data.data),
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

  const columns: ColumnsType<Task> = [
    {
      title: "Project",
      dataIndex: "projectId",
      key: "project",
      render: (text) => <Text>{text}</Text>,
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
          onClick={() => handleTaskIdClick(record.id)}
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
      render: (reporterId) => <Text>{reporterId}</Text>,
    },
    {
      title: "Assignee's",
      dataIndex: "assigneeIds",
      key: "assignees",
      render: (assigneeIds: string[]) => (
        <Avatar.Group>
          {assigneeIds?.map((assigneeId: string, index: number) => {
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
                key={assigneeId}
                style={{
                  backgroundColor: bgColor,
                  fontSize: 12,
                  width: 28,
                  height: 28,
                  marginLeft: index === 0 ? 0 : -8,
                  border: "2px solid #fff",
                  zIndex: assigneeIds.length - index,
                }}
              >
                {assigneeId.charAt(0).toUpperCase()}
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
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Due date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
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
          <Select.Option value={0}>Todo</Select.Option>
          <Select.Option value={1}>InProgress</Select.Option>
          <Select.Option value={2}>NTD</Select.Option>
          <Select.Option value={3}>Done</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <>
      <Row
        justify="space-between"
        align="middle"
        style={{margin:"8px  8px", padding: "8px" }}
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
        <Col>
          <Input.Search
            placeholder="Search"
            allowClear
            style={{ width: 200 }}
          />
        </Col>
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