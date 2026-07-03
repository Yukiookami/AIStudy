export type AdminUserRole = "管理者" | "編集者" | "閲覧者";
export type AdminUserStatus = "有効" | "停止";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  employeeCode: string;
  status: AdminUserStatus;
}

export interface AdminUserFormValues {
  name: string;
  email: string;
  role: AdminUserRole;
  employeeCode: string;
  status: AdminUserStatus;
}

export interface UserSearchValues {
  keyword?: string;
  role?: AdminUserRole;
}
