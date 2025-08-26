import React, { useState, useEffect } from 'react';
import { Row, Col, Avatar, Typography, List } from 'antd';
import { activityLogApi } from '../Api/Api';
import type { ActivityLog } from '../Api/type';

const { Text, Title } = Typography;

const TaskLog: React.FC = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [todayLogs, setTodayLogs] = useState<ActivityLog[]>([]);
  const [yesterdayLogs, setYesterdayLogs] = useState<ActivityLog[]>([]);
  const [olderLogs, setOlderLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await activityLogApi.getActivityLogs();
        const logs = response.data.data;
        setActivityLogs(logs);
        
        // Group logs by date
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const todayLogs = logs.filter(log => {
          const logDate = new Date(log.createdAt);
          return logDate.toDateString() === today.toDateString();
        });
        
        const yesterdayLogs = logs.filter(log => {
          const logDate = new Date(log.createdAt);
          return logDate.toDateString() === yesterday.toDateString();
        });
        
        const olderLogs = logs.filter(log => {
          const logDate = new Date(log.createdAt);
          return logDate < yesterday;
        });
        
        setTodayLogs(todayLogs);
        setYesterdayLogs(yesterdayLogs);
        setOlderLogs(olderLogs);
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    };
    
    fetchData();
  }, []);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068'];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderLogItem = (log: ActivityLog) => {
    const initials = getInitials(log.userName);
    const avatarColor = getAvatarColor(log.userName);
    
    return (
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={2}>
          <Avatar 
            style={{ backgroundColor: avatarColor }}
            size="large"
          >
            {initials}
          </Avatar>
        </Col>
        <Col span={22}>
          <Row>
            <Col span={24}>
              <Text strong>{log.userName}</Text>
              {' '}
              <Text>{log.activityTitle}</Text>
              {' '}
              <Text type="secondary">{log.taskTitle}</Text>
            </Col>
          </Row>
          {log.activityDescription && (
            <Row>
              <Col span={24}>
                <Text type="secondary">{log.activityDescription}</Text>
              </Col>
            </Row>
          )}
          {(log.stateFrom || log.stateTo) && (
            <Row>
              <Col span={24}>
                <Text type="secondary">
                  {log.stateFrom} &gt; {log.stateTo}
                </Text>
              </Col>
            </Row>
          )}
          <Row>
            <Col span={24}>
              <Text type="secondary">{formatTime(log.createdAt)}</Text>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={4}>Task Logs</Title>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Title level={5}>February</Title>
        </Col>
      </Row>
      
      {todayLogs.length > 0 && (
        <>
          <Row>
            <Col span={24}>
              <Title level={5}>Today</Title>
            </Col>
          </Row>
          <List
            dataSource={todayLogs}
            renderItem={renderLogItem}
          />
        </>
      )}
      
      {yesterdayLogs.length > 0 && (
        <>
          <Row>
            <Col span={24}>
              <Title level={5}>Yesterday</Title>
            </Col>
          </Row>
          <List
            dataSource={yesterdayLogs}
            renderItem={renderLogItem}
          />
        </>
      )}
      
      {olderLogs.length > 0 && (
        <List
          dataSource={olderLogs}
          renderItem={renderLogItem}
        />
      )}
    </>
  );
};

export default TaskLog;