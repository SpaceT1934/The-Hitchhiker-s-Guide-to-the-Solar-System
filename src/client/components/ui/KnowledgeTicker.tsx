'use client';

import { useEffect, useRef, useState } from 'react';
import { useSceneStore } from '@/client/store/sceneStore';

// A marquee-style scrolling ticker showing bite-sized astronomy facts.
// Only visible in overview mode (not during journey/voyage/landing).

const FACTS = [
  '太阳占太阳系总质量的 99.86%，所有行星加起来只有它的 0.14%',
  '木星的大红斑已经持续了至少 350 年，比人类发现望远镜的时间还早',
  '金星的一天（243 地球日）比它的一年（225 地球日）还要长',
  '月球正以每年 3.8 厘米的速度远离地球',
  '土星的密度比水还低——理论上一盆足够大的水可以把土星浮起来',
  '旅行者一号发出的信号以光速传回地球也需要超过 22 小时',
  '火星上的奥林匹斯山高 21 公里，是珠穆朗玛峰的 2.5 倍',
  '如果你能站在海王星上，那里的风速可达 2,100 km/h——是地球上最强飓风的 6 倍',
  '国际空间站每 90 分钟绕地球一圈，宇航员每天看 16 次日出',
  '水星虽然最靠近太阳，但金星才是太阳系最热的行星——温室效应的威力',
  '哈勃望远镜能看到 130 亿光年外的光——那些光在宇宙大爆炸后不久就出发了',
  '天王星是被"撞翻"的——它的自转轴几乎平躺在公转面上',
  '月球本身不发光，我们看到的月光其实是反射的太阳光',
  '木星的磁场是地球的 20,000 倍，辐射带强度足以损坏未防护的电子设备',
  '卡西尼号发现土卫二的冰层下存在液态海洋——可能是太阳系除地球外最宜居的地方',
  '火星的红色来自氧化铁——简单说就是生锈了',
  '地球是太阳系中唯一已知有板块构造的行星',
  '人类总共只有 12 个人踏上过月球，而且都是 1969-1972 年间',
  '太阳核心产生的能量需要大约 10 万到 17 万年才能到达太阳表面，然后只需 8 分钟就到地球',
  '海王星是人类通过数学计算"预测"并发现的——牛顿力学的高光时刻',
];

const SCROLL_SPEED = 35; // pixels per second
const GAP_PX = 80; // gap between repeated fact blocks

export function KnowledgeTicker() {
  const { introDone, status, navigatorPhase } = useSceneStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const visible = introDone && status === 'overview' && navigatorPhase === 'closed';

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    // Measure one copy of the text block
    const span = el.querySelector('span');
    if (span) setContentWidth(span.offsetWidth);
  }, []);

  useEffect(() => {
    if (!visible || contentWidth === 0) return;
    let raf: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setOffset((prev) => {
        const next = prev - SCROLL_SPEED * dt;
        // Loop: when scrolled past one full block + gap, reset
        return next <= -(contentWidth + GAP_PX) ? 0 : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, contentWidth]);

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-10 h-8 overflow-hidden pointer-events-none select-none"
      style={{
        opacity: visible ? 0.55 : 0,
        transition: 'opacity 1.2s ease'
      }}
    >
      <div className="absolute inset-0 bg-deep/30 backdrop-blur-[2px]" />
      <div
        ref={containerRef}
        className="absolute top-0 flex items-center h-full whitespace-nowrap"
        style={{ transform: `translateX(${offset}px)` }}
      >
        {/* Render two copies for seamless looping */}
        <span className="inline-block text-stardust/70 text-[9px] tracking-wider2 px-4">
          {FACTS.join('  ·  ·  ·  ')}
        </span>
        <span className="inline-block text-stardust/70 text-[9px] tracking-wider2 px-4" style={{ paddingLeft: GAP_PX }}>
          {FACTS.join('  ·  ·  ·  ')}
        </span>
      </div>
    </div>
  );
}
