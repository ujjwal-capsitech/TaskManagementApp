import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Row, Col, Divider, Typography, Drawer } from "antd";
import { taskApi, userApi, projectApi } from "../Api/Api";
import TaskOverview from "./TaskOverview";
import TaskLog from "../components/TaskLog";
import type { Task } from "../Api/type";

const { Title } = Typography;

interface TaskOverviewPageProps {
  visible: boolean;
  onClose: () => void;
}

const TaskOverviewPage: React.FC<TaskOverviewPageProps> = ({
  visible,
  onClose,
}) => {
  const { taskId } = useParams<{ taskId: string }>();

  const { data: taskData } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskApi.getTask(taskId!).then((res) => res.data.data),
    enabled: !!taskId && visible,
  });

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getUsers().then((res) => res.data.data),
  });

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectApi.getProjects().then((res) => res.data.data),
  });

  if (!taskData) return null;
  
  return (
    <Drawer
      title="Task Overview"
      width={1000}
      onClose={onClose}
      open={visible}
      bodyStyle={{ padding: "24px" }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Title level={4}>Task Overview</Title>
          <TaskOverview
            task={taskData}
            users={usersData || []}
            projects={projectsData || []}
          />
        </Col>
        <Col span={12}>
          <Title level={4}>Task Logs</Title>
          <TaskLog taskId={taskId!} />
        </Col>
      </Row>
    </Drawer>
  );
};

export default TaskOverviewPage;
