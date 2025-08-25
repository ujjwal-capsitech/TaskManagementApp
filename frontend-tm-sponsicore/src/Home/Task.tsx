
import React, { useState } from "react";
import {
  Table,
  Button,
  Row,
  Col,
  Avatar,
  Typography,
  Tag,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../Api/Api";
import type { Task } from "../Api/type";
import CreateTaskDrawer from "../components/CreateTaskDrawer";

// Priority Images
import HighPriority from "../assets/High_Priority.svg";
import LowPriority from "../assets/Low_Priority.svg";
import NormalPriority from "../assets/Nornal_Priority.svg";
// import Attachment from "../assets/Attachment.svg";
const { Text } = Typography;

const TaskPage: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

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

  const statusColors: Record<number, string> = {
    0: "blue",
    1: "orange",
    2: "red",
    3: "green",
  };

  const columns: ColumnsType<Task> = [
    {
      title: "Project",
      dataIndex: ["project", "projectName"],
      key: "project",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Task Id",
      dataIndex: "taskId",
      key: "taskId",
      render: (id: string) => (
        <Text strong style={{ color: "#f5222d" }}>
          {id}
        </Text>
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
      dataIndex: ["reporter", "name"],
      key: "reporter",
    },
    {
      title: "Assignee's",
      dataIndex: "assignees",
      key: "assignees",
      render: (assignees) =>
        assignees?.map((a: any) => (
          <Avatar
            key={a.id}
            style={{ background: "#fde3cf", color: "#f56a00", marginRight: 4 }}
          >
            {a.name.charAt(0)}
          </Avatar>
        )),
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
            {priority === 2 ? "High" : priority === 1 ? "Normal" : "Low"}
          </Text>
        </Row>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <Tag color={statusColors[status]}>
          {status === 0
            ? "To do"
            : status === 1
            ? "In progress"
            : status === 2
            ? "NTD"
            : "Done"}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 ,padding:'8px'}}>
        <Col>
          <Button
            type="primary"
            style={{ backgroundColor: "#01B075", borderColor: "#01B075" }}
            onClick={() => setDrawerVisible(true)}
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
          />
        </Col>
      </Row>

      <CreateTaskDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
};

export default TaskPage;
