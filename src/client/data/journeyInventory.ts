// Static inventory the Navigator route gives the LLM as context, and uses
// to validate the LLM's response. Everything the model is allowed to
// reference must appear here.

import { MOVIES_BY_PATH } from './movieInfo';
import { PLANET_FACTS } from './planetInfo';
import { BOOKS } from './bookInfo';
import type { PlanetId } from '@/client/store/sceneStore';
import type { SpacecraftId } from '@/shared/journey';

export const PLANET_IDS: PlanetId[] = [
  'mercury',
  'venus',
  'earth',
  'moon',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'sun'
];

type SpacecraftInfo = {
  id: SpacecraftId;
  name: string;
  hostPlanet: PlanetId;
  kind: 'surface' | 'orbit' | 'deepspace';
  description: string;
  /** Human-readable status shown in cards. */
  status: string;
  /** Launch year (or deployment year for ISS modules). */
  launched: number;
  /** Agency / country. */
  agency: string;
  /** One-paragraph detail for education cards. */
  detail: string;
};

export const SPACECRAFT: Record<SpacecraftId, SpacecraftInfo> = {
  apollo_lm: {
    id: 'apollo_lm',
    name: '阿波罗登月舱',
    hostPlanet: 'moon',
    kind: 'surface',
    description: '1969 年人类首次踏上月球时留下的金色登月舱，静海基地的金属遗骸。',
    status: '已退役 · 停留月球表面',
    launched: 1969,
    agency: 'NASA（美国）',
    detail: '阿波罗 11 号的登月舱"鹰"号将阿姆斯特朗和奥尔德林送上月球表面后，上升段返回指令舱，下降段至今留在静海基地。登月舱的外壳薄如铝箔——厚度仅 0.3 毫米，却保护了人类在真空中的第一次行走。'
  },
  viking_1: {
    id: 'viking_1',
    name: '海盗一号',
    hostPlanet: 'mars',
    kind: 'surface',
    description: '1976 年抵达火星的第一艘成功着陆器，在 Chryse Planitia 工作了六年多。',
    status: '已退役 · 停留火星表面',
    launched: 1975,
    agency: 'NASA（美国）',
    detail: '海盗一号是人类第一个成功在火星表面软着陆并进行长期科学实验的探测器。它拍摄了第一张火星表面的彩色照片，并进行了著名的"标记释放实验"来寻找火星微生物——虽然结果至今仍有争议，但它开启了人类对火星生命的科学探索。'
  },
  perseverance: {
    id: 'perseverance',
    name: '毅力号',
    hostPlanet: 'mars',
    kind: 'surface',
    description: '2021 年降落 Jezero 火山口的火星车，正在收集等待人类来取的样品管。',
    status: '工作中',
    launched: 2020,
    agency: 'NASA（美国）',
    detail: '毅力号携带了 Ingenuity 直升机一同抵达火星。它的核心任务是寻找远古微生物存在的证据，并首次在火星上收集和封装岩石样本。这些样品管将被未来的火星返回任务带回地球——这将是人类第一次从另一颗行星取回物质样本。'
  },
  ingenuity: {
    id: 'ingenuity',
    name: '机智号',
    hostPlanet: 'mars',
    kind: 'surface',
    description: '人类在地球之外第一架受控飞行的直升机，在火星稀薄大气中起飞过 72 次。',
    status: '已退役 · 停留火星表面',
    launched: 2020,
    agency: 'NASA（美国）',
    detail: '火星大气密度只有地球的 1%，机智号要在这样的环境中飞行——相当于在地球上 30 公里高空操作直升机。它的旋翼转速高达 2,400 转/分（地球直升机通常 500 转/分）。原计划只飞 5 次，实际完成了 72 次飞行，是工程学的奇迹。'
  },
  iss: {
    id: 'iss',
    name: '国际空间站',
    hostPlanet: 'earth',
    kind: 'orbit',
    description: '距地面 400 公里的轨道实验室，二十多年来从未空过人。',
    status: '工作中 · 预计运行至 2030 年',
    launched: 1998,
    agency: '多国合作（美/俄/欧/日/加）',
    detail: '国际空间站以约 28,000 km/h 的速度绕地球飞行，每 90 分钟绕一圈。宇航员每天能看 16 次日出日落。它是人类历史上最昂贵的单体工程（超过 1,500 亿美元），在微重力环境下进行了数千项科学实验，从蛋白质结晶到燃烧物理。'
  },
  hubble: {
    id: 'hubble',
    name: '哈勃望远镜',
    hostPlanet: 'earth',
    kind: 'orbit',
    description: '距地面 540 公里的太空之眼，看见了宇宙诞生后五亿年的光。',
    status: '工作中（1990 年发射，五次维修）',
    launched: 1990,
    agency: 'NASA / ESA（美国/欧洲）',
    detail: '哈勃望远镜不受地球大气干扰，能看到 130 亿光年外的星系。它最著名的成果之一——哈勃深场——在一小片"空白"天空中发现了数千个前所未见的遥远星系。发射初期因镜面误差产生模糊图像，1993 年宇航员在轨道上为其安装了"眼镜"，这是人类第一次在太空维修天文台。'
  },
  lro: {
    id: 'lro',
    name: '月球勘测轨道器',
    hostPlanet: 'moon',
    kind: 'orbit',
    description: '绕月十五年的高分辨率眼睛，把每一处阿波罗着陆点都重新拍了一遍。',
    status: '工作中',
    launched: 2009,
    agency: 'NASA（美国）',
    detail: 'LRO 拍摄了阿波罗 11、12、14、15、16、17 号所有着陆点的超高分辨率照片，甚至能看到宇航员的脚印轨迹和月球车留下的车辙。它还绘制了迄今为止最精确的月球地形图，为未来的月球基地选址提供了关键数据。'
  },
  cassini: {
    id: 'cassini',
    name: '卡西尼号',
    hostPlanet: 'saturn',
    kind: 'orbit',
    description: '在土星身边度过十三年，最后一次主动俯冲进土星大气层。',
    status: '已退役 · 2017 年坠入土星',
    launched: 1997,
    agency: 'NASA / ESA / ASI（美/欧/意）',
    detail: '卡西尼号飞行了 7 年才抵达土星，随后在轨工作 13 年。它发现了土卫二（Enceladus）南极喷出的冰晶水柱——这意味着土卫二冰层下存在液态海洋，是太阳系中寻找地外生命最有希望的地点之一。2017 年为避免污染可能存在生命的卫星，主动坠入土星大气层焚毁。'
  },
  voyager_1: {
    id: 'voyager_1',
    name: '旅行者一号',
    hostPlanet: 'neptune',
    kind: 'deepspace',
    description: '人类制造的距离地球最远的物体，带着金唱片，孤独地飞向星际空间。',
    status: '工作中 · 已进入星际空间',
    launched: 1977,
    agency: 'NASA（美国）',
    detail: '旅行者一号于 2012 年正式离开太阳风层，成为第一个进入星际空间的人造物体。它目前距离地球超过 240 亿公里，信号以光速传回也需要 22 小时以上。它携带着一张镀金铜唱片，收录了地球的声音、音乐和 55 种语言的问候——这是人类写给宇宙的一封瓶中信。'
  }
};

export const SPACECRAFT_IDS = Object.keys(SPACECRAFT) as SpacecraftId[];

// -------- Prompt block builders ---------------------------------------------

// Format the inventory blocks the LLM sees. Keep these terse and structured —
// the model is better at honoring constraints when it sees them as a list.

export function buildPlanetsBlock(): string {
  return PLANET_IDS.map((id) => {
    const f = PLANET_FACTS[id];
    const factSummary = f.facts.map(([k, v]) => `${k}:${v}`).join(' · ');
    return `  - ${id}（${f.nameZh}/${f.nameEn}·${f.category}）
      ${f.description}
      关键数据: ${factSummary}
      亮点: ${f.highlight}`;
  }).join('\n');
}

export function buildSpacecraftBlock(): string {
  return SPACECRAFT_IDS.map((id) => {
    const s = SPACECRAFT[id];
    const loc = s.kind === 'surface' ? `${s.hostPlanet} 表面` : s.kind === 'orbit' ? `${s.hostPlanet} 轨道` : '深空';
    return `  - ${id}（${s.name}·${loc}·${s.agency}·${s.launched}年发射·${s.status}）
      ${s.description}
      详情: ${s.detail}`;
  }).join('\n');
}

export function buildBooksBlock(): string {
  return BOOKS.map(
    (b) =>
      `  - ${b.titleZh}《${b.titleEn}》${b.author}·${b.year}·${b.kind === 'fiction' ? '小说' : '科普'}
      简介: ${b.description}
      关联: ${b.planet}`
  ).join('\n');
}

export function buildFilmsBlock(): string {
  // Show full description (already short) + themes line so the LLM can
  // do precise mood matching, not just guess from a 50-char snippet.
  return Object.values(MOVIES_BY_PATH)
    .map(
      (m) =>
        `  - ${m.poster}\n      ${m.titleZh}《${m.titleEn}》${m.year}${m.director ? ` · ${m.director}` : ''}\n      简介: ${m.description}\n      主题: ${m.themes.join(' / ')}`
    )
    .join('\n');
}

// -------- Validation ---------------------------------------------------------

export function isValidPlanetId(s: unknown): s is PlanetId {
  return typeof s === 'string' && (PLANET_IDS as string[]).includes(s);
}

export function isValidSpacecraftId(s: unknown): s is SpacecraftId {
  return typeof s === 'string' && (SPACECRAFT_IDS as string[]).includes(s);
}

export function isValidFilmPath(s: unknown): s is string {
  return typeof s === 'string' && s in MOVIES_BY_PATH;
}
