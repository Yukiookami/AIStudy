import type { PropsWithChildren } from "react";
import { Typography } from "antd";
import "./AppPageLayout.scss";

interface AppPageLayoutProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

const { Title, Paragraph } = Typography;

// 画面全体で共通利用するシンプルなレイアウトです。
export function AppPageLayout({
  title,
  subtitle,
  children,
}: AppPageLayoutProps) {
  return (
    <div className="app-page-layout">
      <div className="app-page-layout__card">
        <div className="app-page-layout__header">
          <Title level={2}>{title}</Title>
          <Paragraph>{subtitle}</Paragraph>
        </div>
        <div className="app-page-layout__content">{children}</div>
      </div>
    </div>
  );
}
