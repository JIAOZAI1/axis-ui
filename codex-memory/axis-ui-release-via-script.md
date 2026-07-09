---
name: axis-ui-release-via-script
description: "axis-ui 发布必须走 scripts/release.sh,不要手动 npm publish / git tag"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 479308a0-9148-4b37-8b2c-931c25710873
---

用户要求(2026-07-07):axis-ui 的发布一律通过 `scripts/release.sh` 执行(项目内有 `/release` skill 封装完整流程),不要手动执行 npm version / npm publish / git tag。

**Why:** 脚本封装了认证检查、fail-fast 构建、先 publish 后 commit 的安全顺序(发布失败自动还原版本号,不留脏 tag),保证每次发布可重复、可追溯。

**How to apply:** 用户提出"发布/发版/publish"时,调用项目 skill `/release`;流程是先 `./scripts/release.sh --dry-run` 预检,再 `./scripts/release.sh patch|minor|major`。版本位遵循设计规范:删除/重命名 Token 或 API 必须 major 且有 codemod。发布目标是 GitHub Packages,scope 为 `@jiaozai1`(小写,token 在 ~/.npmrc 的 npm.pkg.github.com 行)。
