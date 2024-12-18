import { useEffect } from "react";

import { Tag, Space, Table, Avatar, Typography, notification } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";

import DeleteModal from "./DeleteModal";
import { getDrivers } from "../../api/driver";

const { Column } = Table;
const { Text } = Typography;
const { useNotification } = notification;

const DriversTable = () => {
  const [api, contextHolder] = useNotification();
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = {
    page: searchParams.get("page") || "1",
    search: searchParams.get("search") || undefined,
  };

  function showNotification(description: string) {
    api.error({
      message: "Error",
      description,
    });
  }

  const { error, isLoading, isSuccess, data } = useQuery({
    queryKey: ["Drivers", { ...filter }],
    queryFn: () => getDrivers(filter),
  });

  useEffect(() => {
    if (error) {
      showNotification(error.message);
    }
  }, [error]);

  return (
    <div>
      {contextHolder}
      <Table
        dataSource={isSuccess ? data.data.drivers : []}
        style={{ flex: 1 }}
        loading={isLoading}
        pagination={{
          onChange: (newPage: number) => {
            setSearchParams(
              (prev) => {
                prev.set("page", newPage.toString());
                return prev;
              },
              { replace: true }
            );
          },
          total: isSuccess ? data.data.totalCount : 10,
          pageSize: 10,
          current: Number(searchParams.get("page")) || 1,
        }}
      >
        <Column
          title="Full Name"
          dataIndex="fullName"
          key="fullName"
          render={(text: string) => (
            <Space>
              <Avatar style={{ backgroundColor: "#1677ff" }}>{text[0]}</Avatar>
              <Text>{text}</Text>
            </Space>
          )}
        />
        <Column
          title="Email"
          dataIndex="email"
          key="email"
          render={(text: string) => (
            <Space>
              <CheckCircleFilled style={{ color: "#52c41a" }} />{" "}
              <Text>{text}</Text>
            </Space>
          )}
        />
        <Column
          title="Role"
          key="role"
          render={(_) => (
            <Space>
              <Tag color="success">Driver</Tag>
            </Space>
          )}
        />
        <Column
          title="Action"
          dataIndex="key"
          key="action"
          width={150}
          render={(key: string) => (
            <Space size="middle">
              <DeleteModal id={key} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default DriversTable;
