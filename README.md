# 太阳系漫游指南 · The Hitchhiker's Guide to the Solar System

> 科学从提问开始，想象力带我们抵达星辰。

一个虚实融合的沉浸式 3D 太阳系科普教育作品。向 AI 提出你好奇的天文问题，系统会自动策划一条 4-5 站的科学探索路线——穿梭于真实行星与 NASA 航天器之间，呈现精确的科学数据，并推荐与之共鸣的科幻电影与文学作品。

**核心理念：科学点燃好奇，科幻激发热爱。**

---

## 在线体验

🌐 **http://211.159.160.11:8081/**

---

## 本地开发

```bash
git clone https://github.com/SpaceT1934/The-Hitchhiker-s-Guide-to-the-Solar-System.git
cd The-Hitchhiker-s-Guide-to-the-Solar-System
npm install
cp .env.local.example .env.local   # 编辑填入 API 配置
npm run dev
```

打开 http://localhost:3000

### 环境变量

`.env.local`（已 gitignore）：

```bash
OPENAI_API_KEY=sk-xxxxxxxx
OPENAI_BASE_URL=https://api.deepseek.com
NAVIGATOR_MODEL=deepseek-chat
```

兼容所有 OpenAI 协议 API（DeepSeek / 豆包 / OpenAI / 等）。

---

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Next.js 14 (App Router) + React 18 + TypeScript |
| 3D 引擎 | React Three Fiber 8 · Drei · postprocessing |
| 动画 | GSAP（相机过渡）+ CSS transitions |
| 样式 | Tailwind CSS 3（自定义 `deep` / `stardust` / `nebula` 色板） |
| AI | DeepSeek（支持任意 OpenAI 兼容 API） |
| 语音输入 | Web Speech API |
| 导出 | html-to-image（总结卡 → PNG） |
| 部署 | Ubuntu + Nginx + PM2 + gzip |

---

## 项目结构

```
src/
├── app/                             # Next.js 入口（薄路由层）
│   ├── page.tsx                     # 组合根
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
│   │   ├── landing/                 # 静态开场页
│   │   ├── navigator/               # AI 导览 UI
│   │   ├── planets/                 # 9 行星 + 太阳 3D 组件
│   │   ├── space/                   # 主场景 + 相机 + 航天器 + 星云
│   │   └── ui/
│   │       ├── HUD.tsx              # 顶层 HUD 协调器
│   │       ├── PlanetCard.tsx       # 行星数据卡（7 项数据 + vs Earth）
│   │       ├── ArtifactCard.tsx     # 航天器数据卡（机构/年份/状态）
│   │       ├── LibraryPanel.tsx     # 右侧资料库（电影/航天器/书籍）
│   │       ├── MoviePanel.tsx       # 底部电影详情条
│   │       ├── BookPanel.tsx        # 底部书籍详情条
│   │       ├── KnowledgeTicker.tsx  # 底部冷知识滚动条
│   │       └── VoyagePlot.tsx       # 模式选择器
│   ├── hooks/                       # usePlanetInteraction / useWASDKeys 等
│   ├── store/                       # 全局状态机（React Context）
│   ├── data/
│   │   ├── planetInfo.ts            # 10 颗天体 · 7 项科学数据
│   │   ├── journeyInventory.ts      # 航天器字典 + LLM prompt 构造
│   │   ├── movieInfo.ts             # 28 部科幻电影 · 12 维主题标签
│   │   ├── bookInfo.ts              # 25 本书籍（小说 + 科普）
│   │   └── postersData.ts           # 海报-行星关联 + 视觉参数
│   ├── shaders/                     # 14 个行星 GLSL 着色器
│   ├── utils/                       # voyager 路径曲线
│   └── types/                       # speech 类型声明
│
└── shared/                          # 前后端共享类型
    └── journey.ts

public/
├── models/                          # 9 个 NASA 航天器 GLB（Draco 压缩）
└── textures/
    ├── planets/                     # 行星贴图（Solar System Scope, CC-BY 4.0）
    ├── earth/                       # 地球多通道贴图（昼/夜/云/高光）
    └── picture/                     # 28 张电影海报
```

---

## 内容规模

| 类别 | 数量 | 说明 |
|---|---|---|
| 行星 + 卫星 | 10 颗 | 水金地月火木土天海 + 太阳 |
| 航天器 | 9 个 | Apollo/Viking/Perseverance/Ingenuity/ISS/Hubble/LRO/Cassini/Voyager |
| 科幻电影 | 28 部 | 12 维主题标签，按行星关联 |
| 书籍 | 25 本 | 15 本科幻小说 + 10 本科普读物 |
| 冷知识 | 20 条 | 底部自动滚播 |
| 行星数据 | 10×7 项 | 半径/质量/温度/卫星/探测历史 等 |

---

## 功能清单

- 🪐 **10 颗天体** — NASA 真实贴图 + 自定义 GLSL 着色器
- 🚀 **9 个航天器** — 真实 GLB 模型（Draco 压缩，14MB→8.7MB），带真实轨道/着陆坐标
- 🎬 **28 部科幻电影** — LLM 根据用户问题智能匹配推荐
- 📚 **25 本书籍** — 科幻小说 + 科普读物，图书馆面板分类展示
- 🤖 **AI 科普导览员** — DeepSeek 驱动，⌘K 提问即可策划虚实融合路线
- 📷 **点击交互** — 点击任意行星/航天器显示详细数据卡
- 📖 **资料库** — 右侧面板按行星浏览全部内容，点击即飞
- 🧊 **冷知识滚动条** — 20 条天文趣闻自动滚动播放
- 🌍 **vs Earth 对比** — 每颗行星与地球的体积/年长直观对比
- 🎥 **电影/书籍面板** — 底部详情条，含豆瓣搜索链接
- 🎤 **语音输入** — Web Speech API 中文识别
- 🖼️ **总结卡导出** — 路线终点一键保存 PNG
- 📊 **知识点回顾** — 路线终点展示关键科学数据

---

## 体验流程

```
开场页面（纯文字静态）
    ↓
主太阳系 3D 场景
    ├─ 自由探索：点击天体查看数据卡 · 右侧 Library · 底部冷知识滚动
    └─ ⌘K AI 导览：输入问题 → AI 策划 4-5 站科学路线
                                         ↓
                                   相机 cinematic 飞行
                                         ↓
                                   左上角科学卡（数据 + 电影）
                                         ↓
                                   总结卡 · 知识点回顾 · PNG 导出
```

---

## 设计原则

| 原则 | 体现 |
|---|---|
| 科学第一，想象为辅 | 每站先展示数据，再自然引出电影/书籍 |
| 克制大于华丽 | Hairline 边框 + 玻璃质感 + cosmic 字距，禁用纯白 |
| 慢于人 | 相机 4-5 秒过渡，不抢夺主体注意力 |
| 信息不重复 | 左上角统一展示，不做冗余卡片 |
| 教育语言 | AI 导览、自由探索、探索路线——科普口吻 |

---

## 添加内容

### 行星 / 卫星

1. `src/client/store/sceneStore.tsx` — `PlanetId` 加新 id + `PLANET_LABELS` 加显示名
2. `src/client/data/planetInfo.ts` — `PLANET_FACTS` 加完整条目（facts + description + highlight）
3. `src/client/data/journeyInventory.ts` — `PLANET_IDS` 追加
4. `src/client/components/planets/<New>.tsx` — 新建 3D 组件（参考 Mars/Earth 模板）
5. `src/client/components/space/Scene.tsx` — JSX 中挂载

### 航天器

1. `src/shared/journey.ts` — `SpacecraftId` 加新 id
2. `src/client/data/journeyInventory.ts` — `SPACECRAFT` 字典加条目（name/hostPlanet/kind/status/launched/agency/detail）
3. `public/models/<id>.glb` — 放模型文件，建议用 `gltf-transform draco` 压缩
4. `src/client/components/space/Scene.tsx` — 挂载 `SurfaceArtifact` / `OrbitArtifact`

### 电影

1. `public/textures/picture/<name>.<ext>` — 放海报
2. `src/client/data/movieInfo.ts` — `MOVIES_BY_PATH` 加条目
3. `src/client/data/postersData.ts` — `POSTERS_BY_PLANET` 关联到行星 + 添加 `POSTER_PLACEMENT` 视觉参数

### 书籍

1. `src/client/data/bookInfo.ts` — `BOOKS` 数组加条目（titleZh/author/year/kind/planet/themes）
2. LLM 自动通过 `buildBooksBlock()` 获取书籍列表，无需改 prompt

---

## 性能优化

| 优化项 | 详情 |
|---|---|
| GLB 压缩 | Draco + dedup + prune：14MB → 8.7MB（ingenuity -71%, viking -86%, hubble -75%） |
| 海报压缩 | 28 张海报降至 400px：17MB → 4.3MB |
| 球体面数 | 降低 ~50%（96→64, 80→56, 64→48, 48→32） |
| 后处理 | 移除 ChromaticAberration，Bloom 参数优化 |
| DPR 限制 | `[1, 1.5]`（视网膜屏像素减少 25%） |
| 加载指示 | 顶部进度条显示 3D 资源加载进度 |
| Gzip | nginx gzip 压缩 HTML/JS，传输体积减少 60%+ |
| 总资源 | public/ 37MB → 22MB |

---

## 部署

### 生产环境（本项目的实际部署）

```bash
# 1. 服务器
scp 项目 到服务器
npm install && npm run build

# 2. PM2
pm2 start 'npm start -- -p 3003' --name solar-system
pm2 save

# 3. Nginx（/etc/nginx/conf.d/solar-system.conf）
server {
    listen 8081;
    gzip on;
    gzip_types text/plain text/css application/javascript;
    gzip_comp_level 5;
    location / {
        proxy_pass http://127.0.0.1:3003;
    }
}

# 4. 防火墙开放 8081 端口
```

---

## 路线图

- [ ] 3D 场景距离标尺（AU）
- [ ] 更多书籍扩充
- [ ] LocalStorage 探索历史回放
- [ ] 背景 ambient drone 音效
- [ ] 二维码分享

---

## 致谢

- 行星贴图 — [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC-BY 4.0)
- 航天器模型 — NASA 3D Resources（公共领域）
- 电影/书籍元数据 — 整理自 IMDb / 豆瓣
- 3D 代码参考 — `react-three-fiber` 社区
- GLB 压缩工具 — `gltf-transform`

---

## License

代码 MIT。第三方资源版权归原作者所有。
