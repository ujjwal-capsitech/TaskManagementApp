import React from 'react';
import { Row, Col, Avatar, Typography, Divider, Dropdown, Button, Menu, Select } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

// Static data for activities
const activityData = [
    {
        id: '1',
        userName: 'Eleanor Pena',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'added a comment',
        activityDescription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum',
        createdAt: '07:54 PM',
        dateGroup: 'Today'
    },
    {
        id: '2',
        userName: 'Darrell Steward',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'changed priority',
        stateFrom: 'High',
        stateTo: 'Low',
        createdAt: '07:54 PM',
        dateGroup: 'Today'
    },
    {
        id: '3',
        userName: 'Arlene McCoy',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'added a new task',
        createdAt: '07:54 PM',
        dateGroup: 'Today'
    },
    {
        id: '4',
        userName: 'Esther Howard',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'renamed the task',
        stateFrom: 'low fidelity for the website',
        stateTo: 'Create low fidelity',
        createdAt: '07:54 PM',
        dateGroup: 'Today'
    },
    {
        id: '5',
        userName: 'Leslie Alexander',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'added a comment',
        activityDescription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum',
        createdAt: '07:54 PM',
        dateGroup: 'Today'
    },
    {
        id: '6',
        userName: 'Bessie Cooper',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'changed priority',
        stateFrom: 'High',
        stateTo: 'Low',
        createdAt: '07:54 PM',
        dateGroup: 'Today'
    },
    {
        id: '7',
        userName: 'Savannah Nguyen',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'added a new task',
        createdAt: '07:54 PM',
        dateGroup: 'Today'
    },
    {
        id: '8',
        userName: 'Brooklyn Simmons',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'renamed the task',
        stateFrom: 'low fidelity for the website',
        stateTo: 'Create low fidelity',
        createdAt: '07:54 PM',
        dateGroup: 'Today'
    },
    {
        id: '9',
        userName: 'Darlene Robertson',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'added a comment',
        activityDescription: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum',
        createdAt: '07:54 PM',
        dateGroup: 'Yesterday'
    },
    {
        id: '10',
        userName: 'Darlene Robertson',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'added a comment',
        activityDescription: '',
        createdAt: '07:54 PM',
        dateGroup: 'Yesterday'
    },
    {
        id: '11',
        userName: 'Darlene Robertson',
        taskTitle: 'SC-001 low fidelity for the website',
        activityTitle: 'added a comment',
        activityDescription: '',
        createdAt: '07:54 PM',
        dateGroup: 'Yesterday'
    }
];

// Group activities by date
const groupedActivities = activityData.reduce((groups, activity) => {
    const group = groups[activity.dateGroup] || [];
    group.push(activity);
    groups[activity.dateGroup] = group;
    return groups;
}, {});

const ActivityLog: React.FC = () => {
    // Function to get user initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    };

    // Function to generate a color based on user name
    const getAvatarColor = (name: string) => {
        const colors = [
            '#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068',
            '#1890ff', '#ff4d4f', '#722ed1', '#fa8c16', '#52c41a'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Menu for the three dots
    const menu = (
        <Menu>
            <Menu.Item key="edit">Edit</Menu.Item>
            <Menu.Item key="delete">Delete</Menu.Item>
        </Menu>
    );

    return (
        <Col>
            {/* Header with toggle and month selector */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Button.Group>
                        <Button type="primary">Comment</Button>
                        <Button>Activity</Button>
                    </Button.Group>
                </Col>
                <Col>
                    <Select defaultValue="February" style={{ padding: '8px', borderRadius: '4px' }}>
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </Select>
                </Col>
            </Row>

            <Divider />

            {/* Comment input area */}
            <Row gutter={16} align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Avatar
                        style={{
                            backgroundColor: '#1890ff',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32, 
                            borderRadius: '100px'
                        }}
                    >
                        {getInitials('Current User')}
                    </Avatar>
                </Col>
                <Col flex="auto">
                    <textarea
                        placeholder="Add a comment..."
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #d9d9d9',
                            minHeight: '60px',
                            resize: 'vertical'
                        }}
                    />
                </Col>
                <Col>
                    <Button type="primary">Post</Button>
                </Col>
            </Row>

            <Divider />

            {/* Activities grouped by date */}
            {Object.entries(groupedActivities).map(([dateGroup, activities]) => (
                <Col key={dateGroup} style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ marginBottom: 16 }}>{dateGroup}</Title>

                    {activities.map(activity => (
                        <Row key={activity.id} gutter={16} style={{ marginBottom: 16 }}>
                            <Col>
                                <Avatar
                                    style={{
                                        backgroundColor: getAvatarColor(activity.userName),
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 32,
                                        height: 32
                                    }}
                                >
                                    {getInitials(activity.userName)}
                                </Avatar>
                            </Col>
                            <Col flex="auto">
                                <Row justify="space-between">
                                    <Col>
                                        <Text strong>{activity.userName}</Text>
                                        <Text> {activity.activityTitle} on </Text>
                                        <Text strong>{activity.taskTitle}</Text>
                                    </Col>
                                    <Col>
                                        <Text type="secondary">{activity.createdAt}</Text>
                                    </Col>
                                </Row>

                                {activity.stateFrom && activity.stateTo && (
                                    <Row>
                                        <Col>
                                            <Text>{activity.stateFrom} ? {activity.stateTo}</Text>
                                        </Col>
                                    </Row>
                                )}

                                {activity.activityDescription && (
                                    <Row>
                                        <Col>
                                            <Text>{activity.activityDescription}</Text>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                            <Col>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Button type="text" icon={<EllipsisOutlined />} />
                                </Dropdown>
                            </Col>
                        </Row>
                    ))}
                </Col>
            ))}
        </Col>
    );
};

export default ActivityLog;