import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { DashboardPage } from "./DashboardPage";

function renderDashboardPage() {
  render(
    <MemoryRouter>
      <DashboardPage />
    </MemoryRouter>,
  );
}

async function openCreateModal() {
  const user = userEvent.setup();
  renderDashboardPage();
  await user.click(screen.getByRole("button", { name: "新規追加" }));

  const dialog = await screen.findByRole("dialog", { name: "ユーザー追加" });
  return { user, dialog };
}

function getAddButton(dialog: HTMLElement) {
  return within(dialog).getByRole("button", { name: /追\s*加/ });
}

describe("DashboardPage バリデーション", () => {
  it("必須項目が未入力の場合にエラーを表示する", async () => {
    const { user, dialog } = await openCreateModal();

    await user.click(getAddButton(dialog));

    expect(await screen.findByText("氏名を入力してください。"))
      .toBeInTheDocument();
    expect(await screen.findByText("メールアドレスを入力してください。"))
      .toBeInTheDocument();
    expect(await screen.findByText("社員コードを入力してください。"))
      .toBeInTheDocument();
  });

  it("氏名が文字数範囲外の場合にエラーを表示する", async () => {
    const { user, dialog } = await openCreateModal();

    await user.type(screen.getByLabelText("氏名"), "あ");
    await user.click(getAddButton(dialog));

    expect(
      await screen.findByText("氏名は2文字以上20文字以内で入力してください。"),
    ).toBeInTheDocument();
  });

  it("メールアドレス形式が不正な場合にエラーを表示する", async () => {
    const { user, dialog } = await openCreateModal();

    await user.type(screen.getByLabelText("メールアドレス"), "invalid-mail");
    await user.click(getAddButton(dialog));

    expect(
      await screen.findByText("メールアドレス形式で入力してください。"),
    ).toBeInTheDocument();
  });

  it("社員コード形式が不正な場合にエラーを表示する", async () => {
    const { user, dialog } = await openCreateModal();

    await user.type(screen.getByLabelText("社員コード"), "ABC-123");
    await user.click(getAddButton(dialog));

    expect(
      await screen.findByText("社員コードは EMP-001 の形式で入力してください。"),
    ).toBeInTheDocument();
  });

  it("正しい入力の場合はバリデーションエラーが表示されず追加される", async () => {
    const { user, dialog } = await openCreateModal();

    await user.type(screen.getByLabelText("氏名"), "高橋 次郎");
    await user.type(
      screen.getByLabelText("メールアドレス"),
      "jiro.takahashi@example.com",
    );
    await user.type(screen.getByLabelText("社員コード"), "EMP-004");

    await user.click(getAddButton(dialog));

    await waitFor(() => {
      expect(screen.getByText("高橋 次郎")).toBeInTheDocument();
    });
    expect(screen.queryByText("氏名を入力してください。")).not.toBeInTheDocument();
    expect(
      screen.queryByText("氏名は2文字以上20文字以内で入力してください。"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("メールアドレス形式で入力してください。"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("社員コードは EMP-001 の形式で入力してください。"),
    ).not.toBeInTheDocument();
  });
});
