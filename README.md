# SCIP · Supply Chain Intelligence Platform

化工供应链智能控制塔 + 下游客户采购门户（SCIP Marketplace）的可演示产品原型。

> **作者：** 何欣桐（He Xintong）  
> 项目介绍：[GitHub Profile · scip-platform](https://github.com/Vincy4980/Vincy4980/blob/main/projects/scip-platform.md)

## 快速开始

```bash
pnpm install
pnpm dev
```

- 内部平台：<http://localhost:5173/>
- 客户门户：<http://localhost:5173/marketplace>
- 推荐登录：右上角 → **张伟 EMP-001（控制塔总监）**

```bash
pnpm run build   # 生产构建
pnpm test        # 渠道同步 / 权限核心单测
```

## 产品说明（详细）

请阅读：**[docs/PRODUCT.md](./docs/PRODUCT.md)**

内容包括：为什么做、用户与痛点、双门户架构、能力说明、数据边界、取舍、三分钟演示脚本、下一步落地优先级。

## 仓库结构（简）

| 路径 | 说明 |
|------|------|
| `src/pages/` | SCIP 内部页面 |
| `src/marketplace/` | Marketplace 门户 |
| `src/services/channelSync.ts` | 门户 ↔ 内部订单同步 |
| `src/store/` | 鉴权 / 闭环 / Scippy / 渠道同步 |
| `src/mock/` | 演示数据（含 `scipData.ts`、`marketNews.ts`） |
| `docs/PRODUCT.md` | 产品说明 Case Study |

## 诚实边界

本项目用于验证控制塔 + RBAC + 履约闭环 + 客户门户的产品方案与交互；**业务数据为 Mock**，尚未对接生产 ERP/WMS/TMS。
