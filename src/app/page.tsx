'use client';

import dynamic from 'next/dynamic';
import { HUD } from '@/client/components/ui/HUD';
import { LandingExperience } from '@/client/components/landing/LandingExperience';
import { Navigator } from '@/client/components/navigator/Navigator';
import { JourneyPreview } from '@/client/components/navigator/JourneyPreview';
import { JourneyController } from '@/client/components/navigator/JourneyController';
import { JourneySummary } from '@/client/components/navigator/JourneySummary';
import { JourneyFocusIndicator } from '@/client/components/navigator/JourneyFocusIndicator';
import { SceneStoreProvider } from '@/client/store/sceneStore';

const Scene = dynamic(
  () => import('@/client/components/space/Scene').then((m) => m.Scene),
  {
    ssr: false,
    loading: () => null
  }
);

export default function Page() {
  return (
    <SceneStoreProvider>
      <main className="fixed inset-0 overflow-hidden bg-deep">
        <Scene />
        <HUD />
        <JourneyFocusIndicator />
        <JourneyController />
        <Navigator />
        <JourneyPreview />
        <JourneySummary />
        <LandingExperience />
      </main>
    </SceneStoreProvider>
  );
}
