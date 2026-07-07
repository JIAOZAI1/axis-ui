# 发布到 GitHub Packages

axis-ui 以 npm 包形式发布到 GitHub Packages(`https://npm.pkg.github.com`)。

## 前置说明:包名作用域

GitHub Packages 要求包名必须带 **GitHub 用户名或组织名**作用域,且与仓库归属一致:

```json
{
  "name": "@jiaozai1/axis-ui",
  "repository": { "type": "git", "url": "git+https://github.com/jiaozai1/axis-ui.git" },
  "publishConfig": { "registry": "https://npm.pkg.github.com" }
}
```

> ⚠️ 当前作用域 `@jiaozai1` 是占位值。如果你的 GitHub 用户名/组织名不同,
> 需同步修改三处:`package.json` 的 `name` 与 `repository.url`,以及消费方 `.npmrc` 中的 scope 行。

## 方式一:GitHub Actions 自动发布(推荐)

仓库已内置 [.github/workflows/publish.yml](../.github/workflows/publish.yml):

1. 将本仓库推送到 GitHub(仓库名 `axis-ui`);
2. 更新 `package.json` 的 `version`(遵循语义化版本,见下文版本策略),提交;
3. 在 GitHub 上 **Releases → Draft a new release**,创建 tag(如 `v0.1.0`)并发布;
4. Actions 自动执行 `npm ci → build:lib → npm publish`,无需配置任何 Secret
   (使用自动注入的 `GITHUB_TOKEN`,工作流已声明 `packages: write` 权限)。

也可在 Actions 页面手动触发(workflow_dispatch)补发。

## 方式二:本地手动发布

1. 创建 GitHub **Personal Access Token (classic)**,勾选 `write:packages` 权限;
2. 在本机 `~/.npmrc`(不要提交到仓库)写入认证:

   ```
   //npm.pkg.github.com/:_authToken=ghp_你的Token
   ```

3. 发布(`prepublishOnly` 钩子会自动先执行 `build:lib`):

   ```bash
   npm publish
   ```

## 消费方安装

使用方需要告诉 npm:该作用域的包从 GitHub Packages 拉取。在项目根目录建 `.npmrc`:

```
@jiaozai1:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_只读Token
```

> 即使包是 public,GitHub Packages 的 npm registry 也要求认证,只读 Token 勾选 `read:packages` 即可;
> 企业内部建议将只读 Token 配置在 CI 的 Secret 或私有镜像中,不要写进业务仓库。

然后正常安装与使用:

```bash
npm install @jiaozai1/axis-ui vue
```

```ts
import AxisUI from '@jiaozai1/axis-ui'
import '@jiaozai1/axis-ui/dist/axis-ui.css'

app.use(AxisUI)
```

> 文档与示例中的 `axis-ui` 导入名对应本仓库开发时的 Vite 别名;
> 从 GitHub Packages 安装时,导入路径统一替换为作用域全名 `@jiaozai1/axis-ui`。

## 版本策略(与设计规范一致)

| 变更 | 版本位 | 附加要求 |
|------|--------|----------|
| 新增 Token / 新组件 | minor | — |
| Token 值微调(视觉) | patch | — |
| Token 值明显变化 | minor | 变更说明 |
| 删除 / 重命名 Token 或组件 API | major | 提供 codemod 迁移脚本 + 至少一个版本的 deprecated 废弃期 |

## 产物说明

`npm publish` 只打包 `files` 字段声明的 `dist/`:

| 文件 | 说明 |
|------|------|
| `dist/axis-ui.js` | ESM 产物(`module` / `exports.import`) |
| `dist/axis-ui.umd.cjs` | UMD 产物(`main` / `exports.require`) |
| `dist/axis-ui.css` | 全量样式(含三层 Token) |
