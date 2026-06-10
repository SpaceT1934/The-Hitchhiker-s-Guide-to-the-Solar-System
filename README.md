# 太阳系漫游指南 · The Hitchhiker's Guide to the Solar System

> 科学从提问开始，想象力带我们抵达星辰。

一个虚实融合的沉浸式 3D 太阳系科普教育作品。用户输入想了解的天文问题，AI 导览员策划一条 4-5 站的科学探索路线，沿途呈现真实行星数据与航天器知识，并推荐与之共鸣的科幻电影——让科学认知与人类想象交汇。

**核心理念：科学点燃好奇，科幻激发热爱。**

---

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000

### 环境变量

`.env.local`（已 gitignore，需自行创建）：

```bash
OPENAI_API_KEY=sk-xxxxxxxx
OPENAI_BASE_URL=https://api.deepseek.com        # 或其他 OpenAI 兼容 API
NAVIGATOR_MODEL=deepseek-chat
```

---

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 14 (App Router) + React 18 + TypeScript |
| 3D | React Three Fiber 8 · Drei · postprocessing |
| 动画 | GSAP + CSS transitions |
| 样式 | Tailwind CSS 3 |
| AI | OpenAI 协议兼容（支持 DeepSeek / 豆包 / OpenAI 等） |
| 语音输入 | Web Speech API（中文识别） |
| 导出 | html-to-image（PNG） |

---

## 项目结构

```
src/
├── app/                             # Next.js 入口（薄路由层）
│   ├── page.tsx                     # 组合根，挂载所有 layer
│   ├── layout.tsx                   # Metadata + 全局布局
│   └── api/journey/route.ts         # LLM HTTP 代理 → 调 server/
│
├── server/                          # 后端业务逻辑
│   └── journey/
│       ├── prompt.ts                # 科普导览员 system prompt
│       ├── validator.ts             # LLM 响应多层校验
│       └── index.ts
│
├── client/                          # 前端
│   ├── components/
│   │   ├── effects/PostFX.tsx       # Bloom + Vignette
│   │   ├── landing/                 # 2 页电影感开场
│   │   ├── navigator/               # AI 导览 UI（输入 → 预览 → 旅程 → 总结）
│   │   ├── planets/                 # 9 行星 + 太阳 3D 组件
│   │   ├── space/                   # 主场景 + 相机 + 航天器 + 星云
│   │   └── ui/                      # HUD · PlanetCard · Library · KnowledgeTicker
│   ├── hooks/                       # usePlanetInteraction · useWASDKeys · 等
│   ├── store/                       # 全局状态机（React Context）
│   ├── data/                        # 行星/航天器/电影数据字典
│   ├── shaders/                     # GLSL 行星着色器
│   ├── utils/                       # 工具函数
│   └── types/                       # 前端类型声明
│
└── shared/                          # 前后端共享类型
    └── journey.ts                   # Journey / Stop / SpacecraftId
```

---

## 体验流程

```
Landing（2 页开场动画）
    ↓
主太阳系场景
    ├─ 自由探索 → 点击行星查看数据卡 · 右侧 Library · 底部冷知识滚动
    └─ ⌘K 导览员 → 输入问题 → AI 策划 4-5 站科学路线
                                    ↓
                                相机 cinematic 飞行
                                    ↓
                              左上角科学卡 + 底部电影推荐
                                    ↓
                              总结卡 · 知识点回顾 · PNG 导出
```

---

## 功能清单

- **9 行星 + 太阳** — NASA 真实贴图，7 项科学数据，vs Earth 对比
- **9 个 NASA 航天器** — 真实 GLB 模型 + 轨道/着陆参数 + 发射年份/机构/状态
- **28 部科幻电影** — 12 维主题标签，LLM 智能匹配推荐
- **AI 科普导览员** — DeepSeek 驱动，根据问题策划虚实融合路线
- **相机系统** — GSAP cinematic 过渡 · 环绕运镜 · WASD 自由飞行
- **冷知识滚动条** — 底部 20 条天文冷知识自动滚播
- **资料库面板** — 右侧按行星浏览所有内容
- **知识点回顾** — 旅程终点展示覆盖的科学关键数据
- **语音输入** — 中文语音识别
- **PNG 导出** — 总结卡一键保存

---

## 添加内容

### 行星 / 卫星

1. `src/client/store/sceneStore.tsx` — `PlanetId` 加新 id + `PLANET_LABELS` 加显示名
2. `src/client/data/planetInfo.ts` — `PLANET_FACTS` 加完整条目
3. `src/client/data/journeyInventory.ts` — `PLANET_IDS` 追加
4. `src/client/components/planets/<New>.tsx` — 新建 3D 组件
5. `src/client/components/space/Scene.tsx` — 挂载

### 航天器

1. `src/shared/journey.ts` — `SpacecraftId` 加新 id
2. `src/client/data/journeyInventory.ts` — `SPACECRAFT` 字典加条目
3. `public/models/<id>.glb` — 放模型文件
4. `src/client/components/space/Scene.tsx` — 挂载 `SurfaceArtifact` / `OrbitArtifact`

### 电影

1. `public/textures/picture/<name>.<ext>` — 放海报
2. `src/client/data/movieInfo.ts` — `MOVIES_BY_PATH` 加条目
3. `src/client/data/postersData.ts` — `POSTERS_BY_PLANET` 关联

---

## 设计原则

| 原则 | 体现 |
|---|---|
| 科学第一，想象为辅 | 每站先展示数据，再自然引出电影 |
| 克制大于华丽 | Hairline 边框 + 玻璃质感 + cosmic 字距 |
| 慢于人 | 相机 4-5 秒过渡，不抢主体 |
| 信息不重复 | 左上角统一展示，不做冗余卡片 |

---

## 性能优化

- DPR `[1, 1.5]`（视网膜屏像素减少 25%）
- 球体面数降低 ~50%（96→64, 80→56, 64→48）
- 移除 ChromaticAberration 后处理
- 海报压缩 17MB → 4.3MB
- public/ 总大小 37MB → 22MB

---

## 路线图

- [ ] 3D 场景距离标尺（AU）
- [ ] 旅程结束科普小测验
- [ ] LocalStorage 旅程历史回放
- [ ] 背景 ambient drone 音效
- [ ] 二维码分享

---

## 致谢

- 行星贴图 — [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC-BY 4.0)
- 航天器模型 — NASA 3D Resources
- 电影元数据 — IMDb / 豆瓣
- 3D 代码参考 — `react-three-fiber` 社区

---

## License

代码 MIT。第三方资源版权归原作者所有。
