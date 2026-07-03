import { useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { AppPageLayout } from "../components/AppPageLayout";
import type {
  AdminUser,
  AdminUserFormValues,
  AdminUserRole,
  UserSearchValues,
} from "../types/admin";
import "./DashboardPage.scss";

const { Paragraph, Text, Title } = Typography;

const roleOptions: AdminUserRole[] = ["管理者", "編集者", "閲覧者"];

const initialUsers: AdminUser[] = [
  {
    id: "1",
    name: "山田 太郎",
    email: "taro.yamada@example.com",
    role: "管理者",
    employeeCode: "EMP-001",
    status: "有効",
  },
  {
    id: "2",
    name: "佐藤 花子",
    email: "hanako.sato@example.com",
    role: "編集者",
    employeeCode: "EMP-002",
    status: "有効",
  },
  {
    id: "3",
    name: "鈴木 一郎",
    email: "ichiro.suzuki@example.com",
    role: "閲覧者",
    employeeCode: "EMP-003",
    status: "停止",
  },
];

// ダッシュボード画面を、ユーザー管理用のCRUDデモとして拡張しています。
export function DashboardPage() {
  const navigate = useNavigate();
  const [searchForm] = Form.useForm<UserSearchValues>();
  const [editForm] = Form.useForm<AdminUserFormValues>();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [nextId, setNextId] = useState<number>(initialUsers.length + 1);
  const [searchValues, setSearchValues] = useState<UserSearchValues>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedKeyword = (searchValues.keyword ?? "").trim().toLowerCase();

    return users.filter((user) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        user.name.toLowerCase().includes(normalizedKeyword) ||
        user.email.toLowerCase().includes(normalizedKeyword) ||
        user.employeeCode.toLowerCase().includes(normalizedKeyword);
      const matchesRole = !searchValues.role || user.role === searchValues.role;

      return matchesKeyword && matchesRole;
    });
  }, [searchValues, users]);

  const handleSearch = (values: UserSearchValues) => {
    setSearchValues({
      keyword: values.keyword?.trim(),
      role: values.role,
    });
  };

  const handleSearchReset = () => {
    searchForm.resetFields();
    setSearchValues({});
  };

  const openCreateModal = () => {
    setEditingUser(null);
    editForm.setFieldsValue({
      name: "",
      email: "",
      role: "閲覧者",
      employeeCode: "",
      status: "有効",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      employeeCode: user.employeeCode,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    editForm.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await editForm.validateFields();

      if (editingUser) {
        setUsers((prev) =>
          prev.map((item) =>
            item.id === editingUser.id ? { ...item, ...values } : item,
          ),
        );
        closeModal();
        return;
      }

      setUsers((prev) => [
        ...prev,
        {
          id: String(nextId),
          ...values,
        },
      ]);
      setNextId((prev) => prev + 1);
      closeModal();
    } catch {
      // Ant Design Formのバリデーションエラーはモーダルを閉じずに表示だけを更新する。
    }
  };

  const handleDelete = (user: AdminUser) => {
    Modal.confirm({
      title: "ユーザーを削除しますか？",
      content: `${user.name}（${user.employeeCode}）を削除します。`,
      okText: "削除",
      okType: "danger",
      cancelText: "キャンセル",
      onOk: () => {
        setUsers((prev) => prev.filter((item) => item.id !== user.id));
      },
    });
  };

  const columns: ColumnsType<AdminUser> = [
    {
      title: "氏名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "メールアドレス",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "社員コード",
      dataIndex: "employeeCode",
      key: "employeeCode",
    },
    {
      title: "権限",
      dataIndex: "role",
      key: "role",
      render: (role: AdminUserRole) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "状態",
      dataIndex: "status",
      key: "status",
      render: (status: AdminUser["status"]) => (
        <Tag color={status === "有効" ? "green" : "default"}>{status}</Tag>
      ),
    },
    {
      title: "操作",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => openEditModal(record)}
            size="small"
            type="link"
          >
            編集
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record)}
            size="small"
            type="link"
          >
            削除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AppPageLayout
      title="ユーザー管理"
      subtitle="検索・追加・編集・削除を行える学習用の管理画面です。"
    >
      <div className="dashboard-page">
        <section className="dashboard-page__search">
          <Title className="dashboard-page__section-title" level={5}>
            検索条件
          </Title>
          <Form<UserSearchValues>
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
          >
            <Form.Item<UserSearchValues> label="キーワード" name="keyword">
              <Input
                allowClear
                placeholder="氏名・メールアドレス・社員コード"
              />
            </Form.Item>

            <Form.Item<UserSearchValues> label="権限" name="role">
              <Select
                allowClear
                options={roleOptions.map((role) => ({
                  label: role,
                  value: role,
                }))}
                placeholder="権限を選択"
                style={{ minWidth: 140 }}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button htmlType="submit" type="primary">
                  検索
                </Button>
                <Button onClick={handleSearchReset}>リセット</Button>
              </Space>
            </Form.Item>
          </Form>
        </section>

        <section className="dashboard-page__table">
          <div className="dashboard-page__table-header">
            <Text strong>ユーザー一覧</Text>
            <Button onClick={openCreateModal} type="primary">
              新規追加
            </Button>
          </div>

          <Table<AdminUser>
            columns={columns}
            dataSource={filteredUsers}
            pagination={{ pageSize: 5 }}
            rowKey="id"
          />
        </section>

        <Paragraph type="secondary">
          追加・編集フォームでは、必須チェック、文字数チェック、入力形式チェックを行います。
        </Paragraph>

        <Button onClick={() => navigate("/")} size="large">
          ログイン画面へ戻る
        </Button>
      </div>

      <Modal
        cancelText="キャンセル"
        okText={editingUser ? "更新" : "追加"}
        onCancel={closeModal}
        onOk={handleSave}
        open={isModalOpen}
        title={editingUser ? "ユーザー編集" : "ユーザー追加"}
      >
        <Form<AdminUserFormValues>
          form={editForm}
          initialValues={{ role: "閲覧者", status: "有効" }}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item<AdminUserFormValues>
            label="氏名"
            name="name"
            rules={[
              { required: true, message: "氏名を入力してください。" },
              {
                min: 2,
                max: 20,
                message: "氏名は2文字以上20文字以内で入力してください。",
              },
            ]}
          >
            <Input placeholder="例: 山田 太郎" />
          </Form.Item>

          <Form.Item<AdminUserFormValues>
            label="メールアドレス"
            name="email"
            rules={[
              { required: true, message: "メールアドレスを入力してください。" },
              {
                type: "email",
                message: "メールアドレス形式で入力してください。",
              },
            ]}
          >
            <Input placeholder="example@company.com" />
          </Form.Item>

          <Form.Item<AdminUserFormValues>
            label="社員コード"
            name="employeeCode"
            rules={[
              { required: true, message: "社員コードを入力してください。" },
              {
                pattern: /^EMP-\d{3}$/,
                message: "社員コードは EMP-001 の形式で入力してください。",
              },
            ]}
          >
            <Input placeholder="EMP-001" />
          </Form.Item>

          <Form.Item<AdminUserFormValues>
            label="権限"
            name="role"
            rules={[{ required: true, message: "権限を選択してください。" }]}
          >
            <Select
              options={roleOptions.map((role) => ({
                label: role,
                value: role,
              }))}
            />
          </Form.Item>

          <Form.Item<AdminUserFormValues>
            label="状態"
            name="status"
            rules={[{ required: true, message: "状態を選択してください。" }]}
          >
            <Select
              options={[
                { label: "有効", value: "有効" },
                { label: "停止", value: "停止" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </AppPageLayout>
  );
}
