import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const FPS = 30;
export const INTRO = 105; // 3.5s
export const VIDEO = 282; // 9.4s
export const OUTRO = 195; // 6.5s
export const TOTAL = INTRO + VIDEO + OUTRO;

const STEPS = ['Linux', 'Networking', 'Scripting', 'CI/CD', 'Containers', 'IaC', 'Cloud', 'Monitoring', 'Claude Code'];
const C = {bg: '#07080f', ink: '#f5f6ff', dim: '#8a8fa8', hot: '#ff4d8d', gold: '#ffc83d', ai: '#8b6bff', cyan: '#3de0ff'};
const font = '-apple-system, "SF Pro Display", "Helvetica Neue", Inter, sans-serif';

const useSpring = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  return spring({frame: frame - delay, fps: FPS, config: {damping, stiffness: 140, mass: 0.7}});
};

const Backdrop: React.FC<{accent?: string}> = ({accent = C.ai}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 900px at ${50 + Math.sin(f / 40) * 20}% ${30 + Math.cos(f / 50) * 10}%, ${accent}55, transparent 70%)`}} />
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg,#ffffff08 1px, transparent 1px)', backgroundSize: '80px 80px', transform: `translateY(${(f * 1.5) % 80}px)`}} />
    </AbsoluteFill>
  );
};

/* ---------- INTRO: the old way = a long climb ---------- */
const Intro = () => {
  const f = useCurrentFrame();
  const out = interpolate(f, [INTRO - 10, INTRO], [1, 0], {extrapolateLeft: 'clamp'});
  const title = useSpring(0);
  const shake = f > 78 ? Math.sin(f * 3) * (f - 78) * 0.25 : 0;
  return (
    <AbsoluteFill style={{opacity: out, fontFamily: font}}>
      <Backdrop accent={C.hot} />
      <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', transform: `scale(${title})`}}>
        <div style={{color: C.dim, fontSize: 44, letterSpacing: 8, fontWeight: 600}}>EVERY EXPERT STARTED AT STEP 1</div>
        <div style={{color: C.ink, fontSize: 118, fontWeight: 900, lineHeight: 1.0, marginTop: 24}}>
          The climb is<br />
          <span style={{color: C.hot}}>steep.</span> Keep going.
        </div>
      </div>
      <div style={{position: 'absolute', bottom: 230, left: 0, right: 0, display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', gap: 10, transform: `translateX(${shake}px)`}}>
        {STEPS.slice(0, 8).map((s, i) => {
          const p = spring({frame: f - 18 - i * 6, fps: FPS, config: {damping: 11, stiffness: 160}});
          const hue = 200 + i * 20;
          return (
            <div key={s} style={{width: 340 + i * 58, opacity: p, transform: `translateY(${(1 - p) * 120}px)`, background: `linear-gradient(90deg, hsl(${hue} 70% 38%), hsl(${hue + 20} 70% 30%))`, color: '#fff', fontSize: 42, fontWeight: 800, padding: '12px 0', textAlign: 'center', borderRadius: 14, boxShadow: '0 10px 30px #0008'}}>
              {i + 1}. {s}
            </div>
          );
        })}
      </div>
      <Sequence from={80}>
        <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', color: C.gold, fontSize: 64, fontWeight: 900, textShadow: '0 0 40px #ffc83d88'}}>
          …and now you have wings.
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

/* ---------- MIDDLE: the clip + HUD ---------- */
const Hud = () => {
  const f = useCurrentFrame();
  // map clip time to the step being climbed (leap happens ~2s-5s, landing ~7.5s)
  const prog = interpolate(f, [0, 55, 85, 150, 215, 235], [0, 3, 3.5, 8, 8, 8], {extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const leap = interpolate(f, [60, 70, 95], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const land = f - 205;
  const landP = spring({frame: land, fps: FPS, config: {damping: 8, stiffness: 120}});
  return (
    <>
      {/* vertical step meter */}
      <div style={{position: 'absolute', right: 36, top: 330, bottom: 330, width: 14, borderRadius: 7, background: '#ffffff25'}}>
        <div style={{position: 'absolute', bottom: 0, width: '100%', height: `${(prog / 8) * 100}%`, borderRadius: 7, background: `linear-gradient(0deg, ${C.hot}, ${C.gold}, ${C.ai})`, boxShadow: '0 0 24px #ff4d8d'}} />
      </div>
      {/* current-step pill */}
      <div style={{position: 'absolute', left: 40, bottom: 190, background: '#000b', border: '2px solid #ffffff30', borderRadius: 999, padding: '16px 34px', color: C.ink, fontSize: 46, fontWeight: 800, fontFamily: font, backdropFilter: 'blur(8px)'}}>
        <span style={{color: C.gold}}>STEP {Math.min(9, Math.floor(prog) + 1)}</span> · {STEPS[Math.min(8, Math.floor(prog))]}
      </div>
      {/* leap flash */}
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 55%, #ffffff${Math.round(leap * 60).toString(16).padStart(2, '0')}, transparent 60%)`, mixBlendMode: 'screen'}} />
      {f > 62 && f < 120 && (
        <div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center', fontFamily: font, fontSize: 96, fontWeight: 900, color: C.gold, transform: `scale(${spring({frame: f - 62, fps: FPS, config: {damping: 9}})}) rotate(-3deg)`, textShadow: '0 6px 0 #000, 0 0 50px #ffc83d'}}>
          BELIEVE. JUMP.
        </div>
      )}
      {/* landing burst */}
      {land > 0 && (
        <>
          {Array.from({length: 24}).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const d = interpolate(land, [0, 40], [0, 360 + (i % 3) * 80], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
            return <div key={i} style={{position: 'absolute', left: 540 + Math.cos(a) * d, top: 700 + Math.sin(a) * d, width: 18, height: 18, borderRadius: 9, background: i % 2 ? C.gold : C.ai, opacity: interpolate(land, [0, 40], [1, 0], {extrapolateRight: 'clamp'}), boxShadow: '0 0 20px currentColor'}} />;
          })}
          <div style={{position: 'absolute', top: 200, width: '100%', textAlign: 'center', fontFamily: font, fontSize: 110, fontWeight: 900, color: C.ink, transform: `scale(${landP})`, textShadow: `0 0 60px ${C.ai}, 0 6px 0 #000`}}>
            YOU <span style={{color: C.ai}}>MADE IT</span>
          </div>
        </>
      )}
    </>
  );
};

const Clip = () => {
  const f = useCurrentFrame();
  // slow push-in, extra punch at the leap and the landing
  const zoom = 1 + f * 0.0004 + interpolate(f, [60, 72, 100], [0, 0.07, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) + interpolate(f, [205, 215, 245], [0, 0.06, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeIn = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', opacity: fadeIn}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <OffthreadVideo src={staticFile('girl.mp4')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(#0009, transparent 18%, transparent 78%, #000a)'}} />
      <Hud />
    </AbsoluteFill>
  );
};

/* ---------- OUTRO: what changes with LLM agents ---------- */
const ROWS: [string, string][] = [
  ['Stuck on every script', 'Say what you want to build'],
  ['Months to learn a tool', 'A working draft in minutes'],
  ['Debugging alone at 2am', 'An agent debugs beside you'],
  ['Fear of the blank terminal', 'Confidence to ship today'],
];

const Outro = () => {
  const f = useCurrentFrame();
  const head = useSpring(0);
  const cta = spring({frame: f - 140, fps: FPS, config: {damping: 10}});
  return (
    <AbsoluteFill style={{fontFamily: font}}>
      <Backdrop accent={C.ai} />
      <div style={{position: 'absolute', top: 120, width: '100%', textAlign: 'center', transform: `scale(${head})`}}>
        <div style={{color: C.ai, fontSize: 40, letterSpacing: 8, fontWeight: 700}}>WHEN AI AGENTS JOIN YOUR TEAM</div>
        <div style={{color: C.ink, fontSize: 104, fontWeight: 900, lineHeight: 1.02, marginTop: 20}}>
          Your ladder<br />just became a <span style={{color: C.gold}}>launchpad.</span>
        </div>
      </div>
      <div style={{position: 'absolute', top: 640, left: 60, right: 60, display: 'flex', flexDirection: 'column', gap: 26}}>
        {ROWS.map(([a, b], i) => {
          const p = spring({frame: f - 25 - i * 18, fps: FPS, config: {damping: 13, stiffness: 150}});
          const strike = interpolate(f, [45 + i * 18, 58 + i * 18], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * (i % 2 ? 300 : -300)}px)`, background: '#ffffff10', border: '2px solid #ffffff22', borderRadius: 28, padding: '26px 34px', backdropFilter: 'blur(6px)'}}>
              <div style={{position: 'relative', display: 'inline-block', color: C.dim, fontSize: 40, fontWeight: 600}}>
                {a}
                <div style={{position: 'absolute', left: 0, top: '55%', height: 5, width: `${strike}%`, background: C.hot, borderRadius: 3}} />
              </div>
              <div style={{color: C.ink, fontSize: 52, fontWeight: 800, marginTop: 8}}>
                <span style={{color: C.cyan}}>→ </span>{b}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', bottom: 150, width: '100%', textAlign: 'center', transform: `scale(${cta})`, opacity: cta}}>
        <div style={{display: 'inline-block', background: `linear-gradient(90deg, ${C.ai}, ${C.hot})`, borderRadius: 999, padding: '26px 56px', color: '#fff', fontSize: 50, fontWeight: 900, boxShadow: '0 0 70px #8b6bff99'}}>
          Bigger dreams. Start climbing.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Short: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <Sequence from={0} durationInFrames={INTRO}><Intro /></Sequence>
    <Sequence from={INTRO} durationInFrames={VIDEO}><Clip /></Sequence>
    <Sequence from={INTRO + VIDEO} durationInFrames={OUTRO}><Outro /></Sequence>
  </AbsoluteFill>
);
