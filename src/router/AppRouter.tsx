import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";

// 画面遷移を集約するルーターです。
export function AppRouter() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/" />
      <Route element={<DashboardPage />} path="/dashboard" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
