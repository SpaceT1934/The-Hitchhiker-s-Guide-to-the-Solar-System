// Literary works indexed by planetary association.
// Split into fiction (科幻小说) and non-fiction (科普读物) for the Library.

import type { PlanetId } from '@/client/store/sceneStore';

export type BookInfo = {
  titleZh: string;
  titleEn: string;
  author: string;
  year: number;
  kind: 'fiction' | 'nonfiction';
  description: string;
  planet: PlanetId;
  themes: string[];
};

export const BOOKS: BookInfo[] = [
  // ──── Fiction ────
  {
    titleZh: '火星救援',
    titleEn: 'The Martian',
    author: 'Andy Weir（安迪·威尔）',
    year: 2011,
    kind: 'fiction',
    description: '植物学家马克·瓦特尼被遗留在火星，靠种土豆和工程知识独自求生。比电影更硬核——书中每一克氧气、每一卡路里都被精确计算。现代科幻中"用科学解决问题"的典范。',
    planet: 'mars',
    themes: ['求生', '科学拯救', '幽默', '火星', '硬科幻', '个人意志']
  },
  {
    titleZh: '三体',
    titleEn: 'The Three-Body Problem',
    author: '刘慈欣',
    year: 2006,
    kind: 'fiction',
    description: '中国科幻的里程碑。从文革到宇宙尽头，人类第一次接收到外星文明的回复："不要回答。"囊括黑暗森林法则、降维打击等概念，重新定义了人类对宇宙的想象。',
    planet: 'earth',
    themes: ['宇宙社会学', '外星文明', '末日', '中国科幻', '黑暗森林', '史诗', '雨果奖']
  },
  {
    titleZh: '2001：太空漫游',
    titleEn: '2001: A Space Odyssey',
    author: 'Arthur C. Clarke（亚瑟·克拉克）',
    year: 1968,
    kind: 'fiction',
    description: '与库布里克电影同步创作的科幻经典。从猿人触摸黑色石碑到穿越木星之门，一部关于人类进化、人工智能与宇宙奥秘的哲学寓言。',
    planet: 'jupiter',
    themes: ['进化', 'AI', '木星', '神秘', '哲学', '克拉克', '黑色石碑', '史诗']
  },
  {
    titleZh: '流浪地球',
    titleEn: 'The Wandering Earth',
    author: '刘慈欣',
    year: 2000,
    kind: 'fiction',
    description: '太阳即将毁灭，人类在地球表面安装一万座行星发动机，带着家园逃离太阳系。电影只拍了木星危机一段，原著更宏大——两千五百年的宇宙迁徙。',
    planet: 'jupiter',
    themes: ['末日', '集体主义', '大迁徙', '中国科幻', '太阳死亡', '希望', '牺牲']
  },
  {
    titleZh: '索拉里斯星',
    titleEn: 'Solaris',
    author: 'Stanisław Lem（斯坦尼斯瓦夫·莱姆）',
    year: 1961,
    kind: 'fiction',
    description: '波兰科幻大师莱姆的代表作。一颗有意识的海洋行星，能把人类潜意识中的记忆实体化。心理学家来到这里，见到了早已死去的妻子。关于认知边界与人类孤独的最深刻科幻。',
    planet: 'neptune',
    themes: ['意识', '记忆', '哲学', '海洋行星', '孤独', '接触未知', '波兰科幻', '塔可夫斯基']
  },
  {
    titleZh: '与拉玛相会',
    titleEn: 'Rendezvous with Rama',
    author: 'Arthur C. Clarke（亚瑟·克拉克）',
    year: 1973,
    kind: 'fiction',
    description: '一个直径二十公里的圆柱体飞入太阳系。人类派出考察队进入其中，发现一个完全陌生的人造世界。克拉克硬科幻的巅峰——纯粹的探索、纯粹的好奇，没有反派。',
    planet: 'mercury',
    themes: ['外星造物', '探索', '硬科幻', '神秘', '克拉克', '第一次接触', '敬畏']
  },
  {
    titleZh: '安德的游戏',
    titleEn: "Ender's Game",
    author: 'Orson Scott Card（奥森·斯科特·卡德）',
    year: 1985,
    kind: 'fiction',
    description: '天才少年安德在地球轨道上的战斗学校里接受训练，准备迎战外星虫族。一部关于战争、道德与童年的作品——你以为在玩游戏，其实在决定两个文明的命运。',
    planet: 'earth',
    themes: ['战争', '天才', '虫族', '道德困境', '游戏', '成长', '太空军校']
  },
  {
    titleZh: '月球城市',
    titleEn: 'Artemis',
    author: 'Andy Weir（安迪·威尔）',
    year: 2017,
    kind: 'fiction',
    description: '月球第一座城市"阿耳忒弥斯"里的犯罪故事。快递员贾兹为了钱卷入一场工业阴谋。安迪·威尔用他一贯的硬核工程细节描绘了月球殖民地的日常——气压、运输、经济。',
    planet: 'moon',
    themes: ['月球殖民', '犯罪', '工程', '硬科幻', '城市', '幽默', '经济']
  },
  {
    titleZh: '火星纪事',
    titleEn: 'The Martian Chronicles',
    author: 'Ray Bradbury（雷·布拉德伯里）',
    year: 1950,
    kind: 'fiction',
    description: '布拉德伯里的诗意科幻短篇集。人类一波波抵达火星，与正在消亡的火星文明相遇。不是硬科幻，而是关于殖民、孤独与乡愁的散文诗——科幻史上最美的火星之书。',
    planet: 'mars',
    themes: ['殖民', '孤独', '诗意', '火星文明', '短篇', '乡愁', '经典', '布拉德伯里']
  },
  {
    titleZh: '从地球到月球',
    titleEn: 'From the Earth to the Moon',
    author: 'Jules Verne（儒勒·凡尔纳）',
    year: 1865,
    kind: 'fiction',
    description: '科幻小说之父的登月幻想。美国内战后的炮兵俱乐部用一门巨型大炮把三人射向月球。写于阿波罗登月前一百年——凡尔纳精确预测了发射地点（佛罗里达）和返回方式（海上溅落）。',
    planet: 'moon',
    themes: ['登月', '经典', '19世纪', '凡尔纳', '先行者', '冒险', '想象力']
  },
  {
    titleZh: '接触',
    titleEn: 'Contact',
    author: 'Carl Sagan（卡尔·萨根）',
    year: 1985,
    kind: 'fiction',
    description: '天文学家萨根唯一的小说。射电天文学家收到来自织女星的外星信号，里面是一台机器的蓝图。信仰与科学的碰撞、"如果宇宙只有我们，那也太浪费空间了"——一位科学家写给宇宙的情书。',
    planet: 'earth',
    themes: ['SETI', '外星信号', '信仰', '科学', '萨根', '诗意', '织女星', '第一次接触']
  },

  // ──── Non-fiction ────
  {
    titleZh: '时间简史',
    titleEn: 'A Brief History of Time',
    author: 'Stephen Hawking（斯蒂芬·霍金）',
    year: 1988,
    kind: 'nonfiction',
    description: '霍金的科普经典。从大爆炸到黑洞，从时间箭头到宇宙的终极命运——一位坐在轮椅上的天才为普通人打开了宇宙学的大门。全球销量超 2500 万册。',
    planet: 'earth',
    themes: ['宇宙学', '黑洞', '时间', '大爆炸', '经典', '畅销', '霍金', '入门']
  },
  {
    titleZh: '暗淡蓝点',
    titleEn: 'Pale Blue Dot',
    author: 'Carl Sagan（卡尔·萨根）',
    year: 1994,
    kind: 'nonfiction',
    description: '旅行者一号在 60 亿公里外回望地球拍下的照片中，地球只是一个像素。"再看看那个点——那是这里，那是家，那是我们。"萨根用科学家的严谨和诗人的语言讲述人类在宇宙中的位置。',
    planet: 'sun',
    themes: ['宇宙视角', '萨根', '旅行者', '地球', '谦卑', '诗意', '科普经典', '太阳系']
  },
  {
    titleZh: '赶往火星',
    titleEn: 'The Case for Mars',
    author: 'Robert Zubrin（罗伯特·祖布林）',
    year: 1996,
    kind: 'nonfiction',
    description: '火星学会创始人的火星殖民蓝图。祖布林提出了"火星直击"计划——用现有的技术和合理的预算，在十年内把人类送上火星。被无数太空爱好者奉为"火星圣经"。',
    planet: 'mars',
    themes: ['火星殖民', '工程', '航天', '实操', '激励', 'NASA']
  },
  {
    titleZh: '星际穿越中的科学',
    titleEn: 'The Science of Interstellar',
    author: 'Kip Thorne（基普·索恩）',
    year: 2014,
    kind: 'nonfiction',
    description: '诺贝尔物理学奖得主索恩为诺兰电影写的科学解读。虫洞为什么是球形的？米勒星球上的巨浪从何而来？黑洞卡冈都亚的视觉效果如何做到科学精确？一本从电影反推真实物理的绝佳科普。',
    planet: 'saturn',
    themes: ['相对论', '黑洞', '虫洞', '物理学', '诺兰', '电影科学', '引力']
  },
  {
    titleZh: '阿波罗',
    titleEn: 'Apollo',
    author: 'Charles Murray & Catherine Bly Cox',
    year: 1989,
    kind: 'nonfiction',
    description: '阿波罗计划的编年史。不是从宇航员视角，而是从地面控制中心那些年轻的工程师和技术人员——平均年龄只有 26 岁——如何用计算尺和勇气把人类送上月球。公认最好的阿波罗书籍。',
    planet: 'moon',
    themes: ['阿波罗', '登月', '工程', 'NASA', '历史', '团队', '真实事件']
  }
];

// Group by planet for fast lookup in the Library panel.
export const BOOKS_BY_PLANET: Record<PlanetId, BookInfo[]> = (() => {
  const map = {} as Record<PlanetId, BookInfo[]>;
  for (const b of BOOKS) {
    if (!map[b.planet]) map[b.planet] = [];
    map[b.planet].push(b);
  }
  return map;
})();
