#!/usr/bin/env bash
#
# axis-ui 自动化发布脚本
#
# 用法:
#   ./scripts/release.sh [patch|minor|major|x.y.z] [--dry-run]
#
#   patch  默认。Token 值微调等(0.1.1 → 0.1.2)
#   minor  新增组件/Token(0.1.1 → 0.2.0)
#   major  删除/重命名 Token 或组件 API,需配 codemod(0.1.1 → 1.0.0)
#   x.y.z  显式指定版本号
#   --dry-run  只做检查与模拟打包,不改版本、不提交、不发布
#
# 流程:构建 → 版本号提升 → npm publish → git 提交 + 打 tag → 推送远端
# (先 publish 后 commit:发布失败时只需还原 package.json,不留脏提交/脏 tag)

set -euo pipefail
cd "$(dirname "$0")/.."

REGISTRY="https://npm.pkg.github.com"
BUMP="patch"
DRY_RUN=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    patch|minor|major) BUMP="$arg" ;;
    [0-9]*.[0-9]*.[0-9]*) BUMP="$arg" ;;
    *) echo "❌ 未知参数: $arg(可用: patch|minor|major|x.y.z|--dry-run)"; exit 1 ;;
  esac
done

info()  { printf '\033[1;34m▸ %s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m✔ %s\033[0m\n' "$*"; }
fail()  { printf '\033[1;31m✘ %s\033[0m\n' "$*"; exit 1; }

# ---------- 前置检查 ----------
info "检查 GitHub Packages 认证 ($REGISTRY)"
npm whoami --registry="$REGISTRY" >/dev/null 2>&1 \
  || fail "未认证:请确认 ~/.npmrc 有 //npm.pkg.github.com/:_authToken=<token>(需 write:packages 权限)"
ok "已认证为 $(npm whoami --registry="$REGISTRY")"

info "构建组件库(fail fast)"
npm run build:lib >/dev/null
ok "构建通过"

# ---------- dry-run:到此为止,只模拟打包 ----------
if $DRY_RUN; then
  info "dry-run:模拟发布(不改版本、不提交)"
  set +e
  OUTPUT=$(npm publish --dry-run 2>&1)
  STATUS=$?
  set -e
  echo "$OUTPUT" | grep -E "notice (name|version|package size|total files)" || true
  if [ $STATUS -ne 0 ]; then
    # 当前版本已发布过属于预期:正式发布会先提升版本号
    if echo "$OUTPUT" | grep -q "previously published"; then
      CUR=$(node -p "require('./package.json').version")
      ok "当前版本 v$CUR 已在 registry 上(正式发布会先提升版本号,无碍)"
    else
      echo "$OUTPUT"
      fail "dry-run 发布模拟失败,见上方输出"
    fi
  fi
  ok "dry-run 完成,一切就绪"
  exit 0
fi

# ---------- git 仓库 ----------
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  info "当前目录不是 git 仓库,初始化(main 分支)"
  git init -b main >/dev/null
fi

# ---------- 版本号 ----------
OLD_VERSION=$(node -p "require('./package.json').version")
NEW_VERSION=$(npm version "$BUMP" --no-git-tag-version)
ok "版本 v$OLD_VERSION → $NEW_VERSION"

# ---------- 发布(prepublishOnly 会再次构建)----------
info "发布到 $REGISTRY"
if ! npm publish; then
  git checkout -- package.json 2>/dev/null || true
  fail "npm publish 失败,已还原 package.json 版本号(未产生任何提交/tag)"
fi
ok "已发布 $(node -p "require('./package.json').name")@${NEW_VERSION#v}"

# ---------- git 提交 + tag ----------
info "git 提交并打 tag $NEW_VERSION"
git add -A
git commit -m "release: $NEW_VERSION" >/dev/null
git tag -a "$NEW_VERSION" -m "release: $NEW_VERSION"
ok "已提交 $(git rev-parse --short HEAD) 并打 tag $NEW_VERSION"

# ---------- 推送 ----------
if git remote get-url origin >/dev/null 2>&1; then
  info "推送到远端(含 tag)"
  git push origin HEAD --follow-tags
  ok "已推送"
else
  echo "⚠ 未配置远端 origin,跳过推送。关联后执行:"
  echo "  git remote add origin https://github.com/jiaozai1/axis-ui.git"
  echo "  git push -u origin main --follow-tags"
fi

ok "发布完成 🎉  ${NEW_VERSION}"
