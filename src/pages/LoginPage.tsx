import { Button, Checkbox, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { AppPageLayout } from "../components/AppPageLayout";
import type { LoginFormValues } from "../types/auth";
import "./LoginPage.scss";

const { Text } = Typography;

// 認証処理は行わず、ログインボタン押下でダッシュボードへ遷移します。
export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };

  return (
    <AppPageLayout
      title="ログイン"
      subtitle="ユーザー権限管理デモへアクセスします。"
    >
      <div className="login-page">
        <Form<LoginFormValues>
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          <Form.Item<LoginFormValues>
            label="メールアドレス"
            name="email"
            rules={[
              { required: true, message: "メールアドレスを入力してください。" },
              {
                type: "email",
                message: "メールアドレスの形式で入力してください。",
              },
            ]}
          >
            <Input placeholder="demo@example.com" size="large" />
          </Form.Item>

          <Form.Item<LoginFormValues>
            label="パスワード"
            name="password"
            rules={[
              { required: true, message: "パスワードを入力してください。" },
            ]}
          >
            <Input.Password placeholder="パスワードを入力" size="large" />
          </Form.Item>

          <div className="login-page__options">
            <Form.Item<LoginFormValues>
              name="remember"
              valuePropName="checked"
              noStyle
            >
              <Checkbox>ログイン状態を保持する</Checkbox>
            </Form.Item>
            <Text type="secondary">認証処理は実装していません。</Text>
          </div>

          <Form.Item className="login-page__submit">
            <Button block htmlType="submit" size="large" type="primary">
              ログイン
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AppPageLayout>
  );
}
