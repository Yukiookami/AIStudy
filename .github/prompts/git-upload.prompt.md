---
name: git-upload
description: 現在の変更内容を確認し、Git commit と push を行う
agent: agent
---

現在のワークスペースの変更内容を確認し、Git へ commit / push する準備を行ってください。

## 作業方針

- まず変更内容を確認してください。
- いきなり commit や push を実行しないでください。
- commit 前に、変更内容・影響範囲・commit message を提示してください。
- push 前には必ずユーザー確認を取ってください。
- `git push --force` は絶対に使用しないでください。
- `git reset --hard` は絶対に使用しないでください。
- `.env`、秘密情報、不要なログファイル、`node_modules` は commit 対象に含めないでください。

## 作業手順

1. `git status` で変更ファイルを確認する。
2. `git diff --stat` で変更概要を確認する。
3. 必要に応じて `git diff` で具体的な変更内容を確認する。
4. 現在の branch 名を確認する。
5. 変更内容を日本語で要約する。
6. commit message を提案する。
7. 必要に応じて `npm run build` または `npm test` を実行する。
8. commit 対象ファイルを整理する。
9. ユーザーに commit / push してよいか確認する。
10. ユーザーが許可した場合のみ、`git add`、`git commit`、`git push` を実行する。
11. 最後に実行結果を簡潔に報告する。

## commit message ルール

commit message は以下の形式にしてください。

- `feat: ...`
- `fix: ...`
- `test: ...`
- `docs: ...`
- `refactor: ...`
- `chore: ...`

今回の変更内容に最も合う type を選んでください。

## 出力形式

commit / push 前に、以下の形式で確認してください。

### 変更概要

### 変更ファイル

### 確認結果

### 提案 commit message

### 実行確認

この内容で commit / push してよいですか？
