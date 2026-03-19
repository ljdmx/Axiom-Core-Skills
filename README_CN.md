# 🌌 Axiom Core Skills (公理核心引擎)

[![架构层级](https://img.shields.io/badge/Architecture-V10%20Agentic-purple?style=for-the-badge)](https://github.com/ljdmx/Axiom-Core-Skills)
[![编译保护](https://img.shields.io/badge/AST%20Dry--Run-Protected-success?style=for-the-badge)](https://github.com/ljdmx/Axiom-Core-Skills)
[![设计哲学](https://img.shields.io/badge/Philosophy-SOUL%20Manifesto-blue?style=for-the-badge)](https://github.com/ljdmx/Axiom-Core-Skills)

> *深入全栈协同，专注于高级 AI Agent 与项目架构生成。*  
> Axiom Core Skills 是一套高可用、模块化的底层技能编排框架。它旨在使单一 LLM Agent 具备跨端开发、视觉一致性约束、自动化防呆测试及自适应架构的综合能力。

## 🚀 三大核心基床原则
1. **视觉与设计基准**：严谨的 UI 保真度。全系强制应用单一矢量图库（如 Lucide / Phosphor），原生推崇基于属性驱动的组件样式，拒绝松散拼凑的基础模板。
2. **契约与基建守护**：高可用性的后端指挥部。内置 Terraform 校验、底层 AST 预编译拦截验证，从逻辑规划层面试图降低“运行时报错”发生的几率。
3. **物理与交互反馈**：关注应用生命力的交互体系。生成的移动端应用必须关联震动反馈引擎（Haptics），空间场景（ThreeJS）自带符合物理反射光影及 Z 轴深度的前置逻辑。

---

## 📂 详细文件与目录结构

整个架构被高度模块化，物理隔离了常识记忆、任务调度与各端代码规范：

```text
Axiom-Core-Skills/
|   init.bat                                      # Windows原生环境洗脑出厂重置脚本
|   init.js                                       # Node.js 引擎大脑底盘记忆格式化逻辑
|   init.py                                       # Python 引擎大脑底盘记忆格式化逻辑
|   init.sh                                       # Mac/Linux 环境终端重置与格式化守护脚本
|   README.md                                     # 国际版英文全局核心技术总览与生态指引
|   README_CN.md                                  # 深度本地化架构解析书与操作圣经
|
+---backend-core
|   |   divine_interface.md                       # 后端神谕级架构限制与数据库反脆弱规则
|   |   SKILL.md                                  # 后端自动化核心指令集与生成约束准则
|   |
|   +---blueprints
|   |   +---enterprise-rbac
|   |   |       README.md                         # 国际版英文全局核心技术总览与生态指引
|   |   |
|   |   +---go-microservice
|   |   |       README.md                         # 国际版英文全局核心技术总览与生态指引
|   |   |
|   |   +---java-spring-boot
|   |   |       README.md                         # 国际版英文全局核心技术总览与生态指引
|   |   |
|   |   +---nestjs-modular-monolith
|   |   |       README.md                         # 国际版英文全局核心技术总览与生态指引
|   |   |
|   |   +---payment-integrations
|   |   |       README.md                         # 国际版英文全局核心技术总览与生态指引
|   |   |
|   |   \---python-fastapi-serverless
|   |           README.md                         # 国际版英文全局核心技术总览与生态指引
|   |
|   +---docs
|   |   +---domain-auth
|   |   |       backend-rules-advanced.md         # 高阶 JWT/OAuth 安全攻防隔离层设计论
|   |   |
|   |   +---domain-infra
|   |   |       protocols.md                      # TCP/UDP, gRPC 与 REST/GraphQL 传输契约标准
|   |   |       tech-debt-template.md             # 技术债追踪、豁免与核销台账模板
|   |   |
|   |   \---domain-schema
|   |           adr-template.md                   # 架构决策记录(ADR) 标准格式化档案
|   |
|   +---red_team
|   |       security_audit.ts                     # Fuzzing 模糊测试与越权渗透的靶向脚本
|   |
|   +---scripts
|   |       db-init.js                            # 数据库物理结构初始化与库索引建库脚本
|   |       smart-config.js                       # 环境变量防呆与密钥泄露扫描校验脚本
|   |
|   +---templates
|   |   |   _meta.json                            # 智能体路由映射器：决定使用何种模板的元表
|   |   |
|   |   +---go
|   |   |   \---gin
|   |   |           auth_handler.go               # Gin 登录鉴权/Token 颁发标准处理柄
|   |   |           main.go                       # Go 应用服务器入口与优雅停机标准模板
|   |   |           models.go                     # 基于 GORM 的强一致性 ORM 数据模型
|   |   |
|   |   +---java
|   |   |   \---spring-boot
|   |   |           AuthController.java           # Spring MVC 授权/鉴权核心路由控制器
|   |   |           GlobalExceptionHandler.java   # 全局异常捕获与标准化 JSON 格式发生器
|   |   |           SecurityConfig.java           # Spring Security 跨域/拦截过滤器链配置
|   |   |
|   |   +---python
|   |   |   \---fastapi
|   |   |           auth_router.py                # 基于 OAuth2 与 JWT 的鉴权路由验证器
|   |   |           database.py                   # SQLAlchemy 异步连接池与 ORM 会话管理器
|   |   |           main.py                       # FastAPI 生命周期与 CORS 中间件加载入口
|   |   |
|   |   \---typescript
|   |       +---controllers
|   |       |       auth.controller.ts            # TypeScript 标准化身份验证派发器
|   |       |       crud.controller.ts            # 高复用泛型级增删改查路由派发器
|   |       |
|   |       +---routes
|   |       |       rest.routes.ts                # RESTful 设计语境下无状态路由映射库
|   |       |
|   |       \---services
|   |           |   generic.service.ts            # 通用的数据仓储(Repository)基础服务
|   |           |
|   |           \---logging
|   |                   logger.service.ts         # Winston/Pino 结构化日志收集服务
|   |
|   \---tools
|           audit-skill.js                        # 建立内存假容器对后端干跑审计的脚本
|
+---frontend-core
|   |   SKILL.md                                  # 后端自动化核心指令集与生成约束准则
|   |
|   +---docs
|   |       a11y-checklist.md                     # WCAG 2.1 顶级无障碍防线排查清单
|   |       design-math.md                        # 基于斐波那契与黄金分割的网格比演算册
|   |       design-philosophy.md                  # 继承博朗与苹果 Dieter Rams 的审美哲学纲领
|   |       design-token-system.md                # CSS 变量/Tailwind 原子令化语义规程
|   |       frontend-rules-extended.md            # DOM 变异拦截、虚拟列表防卡顿延伸军规
|   |       kinetics-state.md                     # 弹簧阻尼模型等物理非线性缓动交互规范
|   |       MANIFEST.md                           # 前端视觉极权主义宪章，杜绝框架混拼
|   |       visual-excellence.md                  # 版式字距、留白及色彩情感理论规范
|   |
|   +---templates
|   |   |   _meta.json                            # 智能体路由映射器：决定使用何种模板的元表
|   |   |
|   |   +---animations
|   |   |       micro-interactions.md             # 悬停/聚焦微小状态下的细腻质感设计说明
|   |   |
|   |   +---components
|   |   |       data-table.tsx                    # 超万条数据虚拟渲染防卡的数据网格骨架
|   |   |       error-boundary.tsx                # React 自愈式边界防御阻断 UI 部件
|   |   |       loading-spinner.tsx               # 极简化 SVG 及阻尼动画奢感加载器
|   |   |
|   |   +---forms
|   |   |       multi-step-checkout.md            # 防丢防回退状态级电商结账分步设计
|   |   |
|   |   +---layouts
|   |   |       dashboard.layout.tsx              # 控制台标准左中右上架构防崩溃视图架
|   |   |
|   |   +---pages
|   |   |       login.page.tsx                    # 极简留白 OAuth 与通行核心验证落地页
|   |   |
|   |   +---ui-kits
|   |   |       minimalist-luxury.md              # 高端轻奢极简留白配色视觉语系规范
|   |   |       premium-dark-theme.md             # 对 OLED 与极客友好的纯粹深色主题说明
|   |   |
|   |   \---utils
|   |           api-client.ts                     # 携带异常拦截重洗与无痛重试的 Axios 基建
|   |
|   \---tools
|           aesthetic-scorer.js                   # 视觉回归测试工具：代码合入前的 UI 像素评分
|           audit-skill.js                        # 建立内存假容器对后端干跑审计的脚本
|
+---mobile-core
|   |   SKILL.md                                  # 后端自动化核心指令集与生成约束准则
|   |
|   +---docs
|   |   |   components.md                         # Bottom Sheet 底部抽拉原生手势部件的强制化
|   |   |   design-advanced.md                    # 多指触碰、缩放和微动判定等前沿防呆手段
|   |   |   design.md                             # iOS HIG 与 Android 原生审美禁区规避纪律
|   |   |   publishing.md                         # 强力合规自查表，避开海外各大市场的拒审机制
|   |   |
|   |   +---classic
|   |   |       classic.md                        # JS Bridge 线程深层阻塞反抗策略指引
|   |   |
|   |   \---uts
|   |           uni-app-x.md                      # Vue 3 转译原生 Kotlin/Swift 的极性防御手段
|   |
|   \---tools
|           audit-skill.js                        # 建立内存假容器对后端干跑审计的脚本
|
+---product-core
|   |   SKILL.md                                  # 后端自动化核心指令集与生成约束准则
|   |   SKILL_PRIORITY.md                         # 对代理机器人的认知干涉，管控宏大项目的各时序阶段
|   |
|   +---capabilities
|   |       registry.json                         # 通过路由总线进行路由下沉委派的静态总表
|   |
|   +---docs
|   |       INDEPENDENCE_GUIDE.md                 # 抛弃人类断奶指令集：授权系统进行脱产主控指引
|   |       MANIFEST.md                           # 前端视觉极权主义宪章，杜绝框架混拼
|   |       pivot-intelligence.md                 # 需求激变时的微创修改法与重造修正战略记录
|   |       product-execution-gates.md            # 阶段不准逾越的护城河，防代理产生代码狂奔红线
|   |
|   +---governance
|   |       strategic_advisory.md                 # 微服务 vs Serverless 的架构顶层拍板逻辑指点
|   |
|   +---knowledge
|   |       business-intelligence.md              # 留存池计算及深层北极星转化指标埋点心法
|   |
|   +---scripts
|   |       auto-fix.js                           # 全域 eslint 与 ts 类型问题的修复清道夫
|   |       deploy-wizard.js                      # 在各大公有云(AWS/Vercel)跨维度智能发布牵引
|   |       telemetry-analyzer.ts                 # 通过分析代码失败变异行为进化其灵魂的后台服务
|   |       validate.js                           # 拦截致命级别差错代码推入工程的主干防御钩
|   |
|   +---templates
|   |   |   ci-cd-pipelines.md                    # 全自愈流水线部署通道配置文件与脚本族
|   |   |   product-brief.template.md             # 极简业务线与 AI 指令靶向沟通需求 PRD 蓝图
|   |   |   product-spec.template.md              # 深切业务脉络的详尽技术实施 API 设计蓝本
|   |   |   project-nexus.template.json           # 工程冷启动前前后后端交互的字典协议总纲要
|   |   |   project-plan.template.md              # 时间流冲刺模型及里程碑燃尽燃点预报图示表
|   |   |
|   |   +---monorepo-full-stack
|   |   |   |   package.json                      # 跨域微系统相互勾连及包引用的全局唯一锁链
|   |   |   |   README.md                         # 国际版英文全局核心技术总览与生态指引
|   |   |   |
|   |   |   \---scripts
|   |   |           db-migrate.js                 # 强数据库破坏级向下退回与向上升级保护运行壳
|   |   |           db-seed.js                    # 填充工程测试与边界极限假数据的模拟种子箱
|   |   |           deploy.js                     # 集装并分发各个原子项目归入目标云母港的号角
|   |   |           dev.js                        # 联袂启动微应用和后端监听调试容器的热引擎手
|   |   |           setup.js                      # Clone 项目后零成本一键注活全生态环境引导
|   |   |           test.js                       # 穿透全量单元测试与 E2E 核爆验收生成成绩机的引擎
|   |   |
|   |   +---react-spring-boot
|   |   |       README.md                         # 国际版英文全局核心技术总览与生态指引
|   |   |
|   |   \---vue-nestjs-monorepo
|   |           README.md                         # 国际版英文全局核心技术总览与生态指引
|   |
|   \---tools
|           audit-skill.js                        # 建立内存假容器对后端干跑审计的脚本
|           ecosystem-validator.js                # 防止组件循环引用引起系统级瘫痪的隔离毒素清理器
|
+---threejs-core
|   |   SKILL.md                                  # 后端自动化核心指令集与生成约束准则
|   |
|   \---docs
|           advanced-shaders.md                   # 底层 TSL 及 GLSL 顶点级片元级极致压缩光影戏法
|           boilerplates.md                       # 纯净 Three.js 画框与 R3F 纤维微环境开箱召唤符
|           diagnostics.md                        # WebGPU 帧崩坏抓包及严重显存流出的诊断白皮书
|           mobile-xr.md                          # 掌上 WebXR 和 AR 原生护栏规则限制跨越防眩晕纲要
|           particles.md                          # 利用底层核计算渲染器承载百亿粒子的降频规避法阵
|           patterns-catalog.md                   # 多维视角、深度交互以及跨维度感官的滚动长廊图鉴
|           physics.md                            # Rapier 高精度算力约束防卡与抗反物理穿模修正式准则
|           red-lines.md                          # WebGL 全局主线程大阻断及一切红线违宪死刑条例
|           visual-language.md                    # 景深虚化泛光发出的影级感官底色后期特效标准滤镜表
|           webgpu.md                             # 放弃传统 WebGL，拥抱更贴近底层管线的极核 WGSL 指北
|
+---web3-core
|   |   SKILL.md                                  # 后端自动化核心指令集与生成约束准则
|   |
|   +---assets
|   |   \---templates
|   |       |   .env.example                      # RPC 泄密预防，隐私隔爆凭与秘钥空洞脱敏样板示例
|   |       |   deploy.s.sol                      # 借助 Foundry 安全推手对链发动去中心化应用宣告式
|   |       |   foundry.toml                      # 铁腕 Foundry 全域极端强效校验参数及私网快照锚定
|   |       |   hardhat.config.ts                 # 应对旧时代项目无损防摩擦并联处理工具链控制开关
|   |       |
|   |       \---.github
|   |           \---workflows
|   |                   ci.yml                    # 清查气费极大超标以及非严苛限制状态校验判官防线
|   |                   pr-check.yml              # 防范黑客渗透的死寂扫描 Slither 防火墙阻击手
|   |
|   +---docs
|   |       account-abstraction.md                # 消除前置助记词门槛 ERC-4337 无摩擦新用户代充导则
|   |       crosschain.md                         # 互操作链间过桥时序及防抢先与闪电攻击欺诈避雷术
|   |       data-infra.md                         # The Graph 子节点图谱分发索引抗审查极简下放技术点
|   |       defi.md                               # 去中心化金融 AMM 及杠杆闪借防预言机喂价操控极墙
|   |       deploy.md                             # 推主网前最惨烈也最严苛避免归零爆仓起降终查一清单
|   |       frontend-ethersjs.md                  # 屏蔽 Ethers 链端数据响应迟延给前台的无痛掩盖秘药
|   |       frontend-wagmi.md                     # 利用 Wagmi 构建无刷新极强响应连路与跨维前向衔接轨
|   |       l2-deployment.md                      # 在 Layer2 和 Arbitrum 进行经济最优化和体积截断避荒战略
|   |       nft.md                                # ERC-1155 元数据图灵自固资产降碳和碎步合并防篡改协议
|   |       security.md                           # 死敌重入攻击、整型及多签钓鱼狙击录全红禁地安保防鉴
|   |       solidity-core.md                      # 封杀一切过时心裁，坚守 Solidity Yul 闭包隔离铁律大规
|   |       solidity-patterns.md                  # 代理解耦升级模式如 ERC-2535 等钻石分层架构重器热替法
|   |       testing.md                            # 抛弃纯用例，逼迫引擎进行不变量不间断变异渗透破坏测试
|   |       toolchain.md                          # 智能合约编译在 Foundry 和 Hardhat 等不同路口前的天梯表
|   |
|   \---tools
|           audit-skill.js                        # 建立内存假容器对后端干跑审计的脚本
|
\---_core_axioms
    |   client.md                                 # 贯穿各大 LLM 通神注入长连接总线：使混沌回归任务流
    |   context-memory-system.md                  # 使得模型仿佛拥有一生长久意识的历史滑动替换脑容量推算
    |   KERNEL_BOOTSTRAP.md                       # 混沌源初：任何衍生动作开篇都需要吸纳阅读的纪律主源阵
    |   knowledge_graph_schema.md                 # 对本项目 8 大枝干在代码银河中彼此依存的坐标象限总星图
    |   NEXUS_PROTOCOL.md                         # 使后端 API 与前端界面像联邦契约一般紧紧粘合的法则书
    |   NEXUS_SPEC.md                             # 针对联邦契约在底层传输和字段序列化脱敏等细节规范释义
    |   SOUL_MANIFESTO.md
    |   template-matching-algorithm.md            # 百种蓝图中运用正则快寻法并让模型自主定位项目的思维树
    |   template-quality-assurance.md             # 在脚手架源源不断注入磁盘前的病毒防线与错别字扫雷系统
    |
    +---evolution
    |       analytics.json                        # 监控 LLM 是机灵执行还是懒散拒绝工作并进行智能调优的账簿
    |       patch_history.json                    # 自动将您改过的 Bug 化作其自我纠正直觉神经元网络的主机
    |
    \---memory
        |   project_graph.json                    # 仿佛活过来的神经反射网，动态建立各大自建模块依赖连接库
        |   snippet_vault.json                    # 通过深度过滤不断萃取成黄金、绝高频复用的标准代码藏宝夹
        |   user_profile.json                     # 倒模您作为主理人的美学洁癖、系统格式规则最原本的初始印画
        |
        \---vector_vault
                schema.json                       # 约束如何将千变万化的聊天转化为冰冷精准参数向量碰撞距离的规范
```

---

## 🏗️ 七大核心模块功能概览

| 核心组件 | 战略定位 | 关键技术特性 |
|:---|:---|:---|
| 🧠 **`_core_axioms`** | 统一图谱中枢 | 搭载 RAG 大脑记忆库（Vector Vault），全局系统法则与 `SOUL_MANIFESTO` 储藏地。 |
| 👑 **`product-core`** | 全栈任务调度 | Phase 1.5 资产调度，统筹多端模块（3D、移动、API）的生成与构建时序。 |
| 🎨 **`frontend-core`** | UI 组件引擎 | 建立 MFE 隔离沙箱，约束视觉回归与通用样式还原。 |
| 📱 **`mobile-core`** | 端侧物理接触 | `uni.vibrateShort()` 设备共鸣，基于引力弹簧的滚动阈值与曲线计算。 |
| 🛡️ **`backend-core`** | 后端基础服务 | 安全沙箱编译拦截，支持导出符合校验规则的云端 IaC 基础设施描述代码。 |
| 🌐 **`web3-core`** | 链上合约协作 | EVM/Solidity 类型对接，约束前后端数据传输状态机逻辑。 |
| 🪐 **`threejs-core`** | 3D/空间渲染 | R3F 工具集规范，兼具 Apple Vision Pro / WebXR 空间降维防错机制。 |

---

## ⚡ 快速开始：初始化你的 Agent 环境

Axiom 配备了基于持久化 JSON 与抽象语法树（AST）记忆追踪的历史学习机制。当 Agent 日常执行开发任务时，会通过 `patch_history.json` 学习针对您的修改偏好。

当您首次把仓库克隆到本地时，为避免引入遗留数据并建立纯粹的本地开发图谱，**请务必初始化环境记忆**：

```bash
# 克隆仓库
git clone https://github.com/your-username/Axiom-Core-Skills.git
cd Axiom-Core-Skills

# 一键清除预设记忆，建立本地知识图谱的基线
./init.sh
# (跨平台支持：在 Windows 环境可直接运行 `init.bat`，或根据环境执行 `node init.js` / `python init.py`)
```

**接入指南**：请将您的本地开发助理（如 Cursor, FastMCP 等集成工具）的系统提示词或核心工作区路径指向仓库内的 `_core_axioms/KERNEL_BOOTSTRAP.md`。Agent 将在运行中逐步适配这些架构规则，以提供高健壮性的长周期代码生成辅助。

---
*为严谨的软件工程赋能。基于 SOUL Manifesto 设计哲学构建。*
