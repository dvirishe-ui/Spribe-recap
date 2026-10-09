import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Story from './components/Story.jsx';
import Activity from './components/Activity.jsx';
import DemoControls from './components/DemoControls.jsx';
import { REPLAY_DATA, deriveReplay } from './data.js';
import { usePrefersReducedMotion } from './hooks.js';

// URL params make scenarios easy to demo/test:
//   ?scenario=high-loss   ?motion=reduce|full   ?view=activity
function readParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export default function App() {
  const [scenario, setScenario] = useState(() => (readParam('scenario') === 'high-loss' ? 'highLoss' : 'normal'));
  const [motion, setMotion] = useState(() => readParam('motion') || 'system');
  const [view, setView] = useState(() => (readParam('view') === 'activity' ? 'activity' : 'story'));

  const systemReduced = usePrefersReducedMotion();
  const reducedMotion = motion === 'reduce' || (motion === 'system' && systemReduced);

  const replay = useMemo(() => deriveReplay(REPLAY_DATA, scenario), [scenario]);

  // Layout effect so the first paint already honours reduced motion.
  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduce' : 'full';
  }, [reducedMotion]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (scenario === 'highLoss') url.searchParams.set('scenario', 'high-loss');
    else url.searchParams.delete('scenario');
    if (motion !== 'system') url.searchParams.set('motion', motion);
    else url.searchParams.delete('motion');
    window.history.replaceState(null, '', url);
  }, [scenario, motion]);

  useEffect(() => {
    document.title =
      replay.mode === 'restrained' ? `Your ${replay.year} summary · ${replay.operator.name}` : `SPRIBE Replay ${replay.year} · ${replay.operator.name}`;
    window.scrollTo(0, 0);
  }, [replay, view]);

  let content;
  if (replay.mode === 'restrained') {
    // High-loss presentation: no story, no celebration, no share card.
    content = <Activity replay={replay} variant="restrained" />;
  } else if (view === 'activity') {
    content = <Activity replay={replay} onBack={() => setView('story')} />;
  } else {
    content = (
      <Story
        replay={replay}
        reducedMotion={reducedMotion}
        onViewActivity={() => setView('activity')}
        initialSlide={0}
      />
    );
  }

  return (
    <>
      {content}
      <DemoControls scenario={scenario} onScenario={setScenario} motion={motion} onMotion={setMotion} />
    </>
  );
}
