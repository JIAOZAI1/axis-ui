---
name: release
description: 发布 axis-ui 到 GitHub Packages。当用户要求"发布/发版/发布新版本/publish/release"时使用。统一走 scripts/release.sh,不要手动执行 npm publish 或 git tag。
---

# axis-ui 发布流程

本项目的发布**只能**通过 `scripts/release.sh` 执行,禁止手动拼接 `npm version` / `npm publish` / `git tag` 命令。

## 步骤

1. **确定版本位**。按设计规范的版本策略选择(用户未指明时询问或按变更内容推断):
   - `patch` — Token 值微调、bug 修复(默认)
   - `minor` — 新增组件、新增 Token
   - `major` — 删除/重命名 Token 或组件 API(必须已提供 codemod 迁移脚本与废弃期,否则提醒用户并停止)
   - 也可传显式版本号 `x.y.z`

2. **先 dry-run 预检**(认证 + 构建 + 模拟打包,零副作用):

   ```bash
   ./scripts/release.sh --dry-run
   ```

3. **dry-run 通过后正式发布**:

   ```bash
   ./scripts/release.sh patch   # 或 minor / major / x.y.z
   ```

   脚本会依次:构建 → 提升版本号 → `npm publish` → git 提交 + 打 `vX.Y.Z` tag → 推送远端(有 origin 时)。

4. **发布后向用户报告**:新版本号、发布的包名、commit/tag,以及是否已推送远端。

## 失败处理

- **认证失败**:检查 `~/.npmrc` 是否有 `//npm.pkg.github.com/:_authToken=<token>`,token 需 `write:packages` 权限;token 挂错 registry 行是历史踩过的坑。
- **publish 404/422**:GitHub 上 `jiaozai1/axis-ui` 仓库不存在或 `repository.url` 不匹配,先建仓库或改 package.json。
- **publish 失败**:脚本已自动还原 package.json 版本号,不会留下脏提交/脏 tag,修复后直接重跑即可。
- **未配置 origin**:脚本会跳过推送并打印关联命令,提醒用户手动执行。

## 约束

- 发布前工作区的所有变更会被一并提交(`git add -A`),如有不应发布的改动,先让用户确认。
- CI 侧另有 Release 触发的自动发布(.github/workflows/publish.yml),本地脚本与其互补,不要在同一版本上重复发布。
