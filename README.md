# The Ladder Became a Launchpad

A 19-second vertical short: a girl leaps up the DevOps staircase (Linux → Networking → Scripting → CI/CD → Containers → IaC → Cloud → Monitoring → Claude Code) to show what changes when AI agents join the team. Built with [Remotion](https://remotion.dev).

**Live: https://rifaterdemsahin.github.io/devops-transformation-video/**

**LinkedIn post (copy-ready): https://rifaterdemsahin.github.io/devops-transformation-video/linkedin.html**

## How it was made
1. **Source clip** – a 9.4 s, 720×1280 AI-generated video of a girl jumping up the staircase (`public/girl.mp4`).
2. **Remotion project** – 1080×1920 @ 30 fps, three `Sequence`s in `src/Short.tsx`:
   - **Intro (3.5 s)** – "The climb is steep. Keep going." with a stack of skill steps springing in.
   - **Clip (9.4 s)** – the video with a slow push-in, extra zoom at the leap and landing, a step meter that tracks the climb, "BELIEVE. JUMP." at the leap and a particle burst plus "YOU MADE IT" at the landing.
   - **Outro (6.5 s)** – "Your ladder just became a launchpad", four before→after cards (struck-through old pain → new capability) and a closing call to action.
3. **Motivational tone** – copy reframes each step as empowerment, not replacement.
4. **Export** – `npm run render` → `out/short.mp4` (H.264 + AAC), copied to `video/` for the page.
5. **Deploy** – `index.html` plays the video on GitHub Pages (main branch, root).

## Run it
```
npm install
npm run dev      # Remotion Studio
npm run render   # exports out/short.mp4
```
