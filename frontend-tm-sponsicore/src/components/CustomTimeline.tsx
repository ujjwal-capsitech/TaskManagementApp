import React, { useState } from "react";
import {
    Timeline,
    Avatar,
    Row,
    Col,
    Typography,
    Dropdown,
    Menu,
    Input,
} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    CloseOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import { mockActivityLogs } from "../Api/type";

// Import your custom assets
import ThreeDot from "../assets/threedot.svg";

const { Text } = Typography;
const { TextArea } = Input;

interface CustomTimelineProps {
    data: typeof mockActivityLogs;
    type: "comment" | "activity";
}

const CustomTimeline: React.FC<CustomTimelineProps> = ({ data, type }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    // Filter data based on type
    const filteredData = data.filter((item) =>
        type === "comment" ? item.activityTitle.includes("comment") : true
    );

    // Group by date
    const groupByDate = (data: typeof mockActivityLogs) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const groups: { [key: string]: typeof mockActivityLogs } = {};

        data.forEach((item) => {
            const itemDate = new Date(item.createdAt);
            let groupKey;

            if (itemDate.toDateString() === today.toDateString()) {
                groupKey = "Today";
            } else if (itemDate.toDateString() === yesterday.toDateString()) {
                groupKey = "Yesterday";
            } else {
                groupKey = itemDate.toLocaleDateString();
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }

            groups[groupKey].push(item);
        });

        return groups;
    };

    const groupedData = groupByDate(filteredData);

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setEditContent(item.activityDescription);
    };

    const handleSave = () => {
        // Add your save logic here
        console.log("Saving content:", editContent);
        setEditingId(null);
        setEditContent("");
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditContent("");
    };

    // Menu for 3-dot dropdown
    const getMenu = (item: any) => (
        <Menu>
            <Menu.Item
                key="edit"
                icon={<EditOutlined />}
                onClick={() => handleEdit(item)}
            >
                Edit
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined style={{ color: "red" }} />}>
                Delete
            </Menu.Item>
        </Menu>
    );

    return (
        <Row style={{ position: "relative" }}>
            {/* vertical line */}
            <Col
                style={{
                    position: "absolute",
                    left: 16,
                    top: 0,
                    bottom: 0,
                    borderLeft: "1px solid #0000000F",
                    zIndex: 0,
                }}
            />

            <Col span={24}>
                {Object.entries(groupedData).map(([date, items]) => (
                    <Row key={date} style={{ marginBottom: 16 }}>
                        {/* Date Header */}
                        <Col span={24} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col>
                                    <Text
                                        style={{
                                            background: "#F4F5FA",
                                            padding: "2px 8px",
                                            borderRadius: "0px 4px 4px 0px",
                                            fontSize: 12,
                                            fontWeight: 500,
                                            width: 58,
                                            height: 18,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginLeft: 8,
                                        }}
                                    >
                                        {date}
                                    </Text>
                                </Col>
                            </Row>
                        </Col>

                        {/* Timeline */}
                        <Col span={24}>
                            <Timeline
                                mode="left"
                                style={{ marginLeft: "10px" }}
                                items={items.map((item, index) => ({
                                    dot: (
                                        <Avatar
                                            size={32}
                                            style={{
                                                backgroundColor:
                                                    index % 2 === 0 ? "#f56a00" : "#7265e6",
                                                fontSize: 12,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                border: "2px solid #fff",
                                                zIndex: 1,
                                            }}
                                        >
                                            {item.userName.charAt(0).toUpperCase()}
                                        </Avatar>
                                    ),
                                    children: (
                                        <Row style={{ paddingBottom: 24 }}>
                                            {/* Header row */}
                                            <Col span={20}>
                                                <Text strong>{item.userName}</Text>
                                                <Text> {item.activityTitle} </Text>
                                                <Text type="secondary">{item.taskId}</Text>
                                            </Col>
                                            <Col
                                                span={4}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    gap: 8,
                                                }}
                                            >
                                                <Text type="secondary">
                                                    {formatTime(item.createdAt)}
                                                </Text>
                                                <Dropdown
                                                    overlay={() => getMenu(item)}
                                                    trigger={["click"]}
                                                >
                                                    <img
                                                        src={ThreeDot}
                                                        alt="options"
                                                        style={{ width: 18, cursor: "pointer" }}
                                                    />
                                                </Dropdown>
                                            </Col>

                                            {/* Task title */}
                                            <Col span={24} style={{ marginTop: 4 }}>
                                                <Text type="secondary">{item.taskTitle}</Text>
                                            </Col>

                                            {/* Description */}
                                            <Col span={24} style={{ marginTop: 8 }}>
                                                {editingId === item.id ? (
                                                    <Row gutter={[0, 8]}>
                                                        <Col span={24}>
                                                            <TextArea
                                                                rows={4}
                                                                value={editContent}
                                                                onChange={(e) =>
                                                                    setEditContent(e.target.value)
                                                                }
                                                            />
                                                        </Col>
                                                        <Col span={24}>
                                                            <Row justify="end" gutter={16}>
                                                                <Col>
                                                                    <CloseOutlined
                                                                        style={{
                                                                            color: "red",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={handleCancel}
                                                                    />
                                                                </Col>
                                                                <Col>
                                                                    <CheckOutlined
                                                                        style={{
                                                                            color: "green",
                                                                            cursor: "pointer",
                                                                        }}
                                                                        onClick={handleSave}
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Col>

                                                    </Row>
                                                ) : (
                                                    <Text>{item.activityDescription}</Text>
                                                )}
                                            </Col>
                                        </Row>
                                    ),
                                }))}
                            />
                        </Col>
                    </Row>
                ))}
            </Col>
        </Row>
    );
};

export default CustomTimeline;
