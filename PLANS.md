# ExecPlan: Door Usage AR Overlay with MindAR (iPhone Web AR)

## 0. Big Picture / Purpose

We want a small WebAR app that runs in the browser (Safari on iPhone, Chrome on desktop) using **MindAR + A-Frame**.  
When the user points the camera at a specific **door** in a room, the app recognizes the door and overlays **text instructions** on top of it (e.g., “1. Tap card here, 2. Wait for green light”).

This ExecPlan describes everything needed so that an engineer or AI agent who knows nothing about the repo can:
- Set up a minimal static web project.
- Prepare an image target for MindAR from a door photo.
- Implement the AR overlay scene with simple text.
- Validate it on desktop and iPhone.
- Leave the project ready for future extension (multi-door, icons, animations).

The final outcome should be:
- A static site you can open on iPhone via HTTPS.
- When the camera sees the target door, text instructions appear stably aligned to the door.
- A human can **record the screen** on iPhone to capture a video of the overlay.

---

## 1. Scope and Non-Goals

**In scope:**
- Single-page WebAR app using MindAR (image tracking) + A-Frame.
- One primary door target (later extensible to multiple doors).
- Overlay with simple text (Japanese or English).
- Minimal styling, no complex UI framework.
- Basic documentation on how to add more doors / text later.

**Out of scope (for this ExecPlan):**
- Full CMS or backend (no login, no database).
- 3D models, complex animations or sound.
- Native iOS app (we stay in the browser; PWA is optional later).
- Advanced performance tuning or analytics.

---

## 2. Repository Orientation

Target structure for this feature (if this plan is the first thing in the repo, the agent should create these):

- `/docs/exec-plans/door-ar-overlay.md`  
  - This ExecPlan (optional path; adjust to repo conventions).
- `/web/`
  - `index.html`  
    - Main WebAR page with MindAR + A-Frame.
  - `styles.css`  
    - Minimal styling (fonts, loading UI, instructions).
  - `/assets/`
    - `door-reference.jpg`  
      - Photo of the actual door in the SANU room (or any room we choose).
    - `door-targets.mind`  
      - MindAR compiled image target file.
- `/README.md`
  - Quick start instructions: how to run locally and deploy.

If the repository already exists with other code, the agent should:
- Add `/web` and `/assets` under a suitable directory (e.g., `/apps/door-ar-overlay/web`).
- Update any root `README.md` “Projects” or “Apps” section to link to this new folder.

---

## 3. Plan of Work (Milestones & Steps)

### Milestone 1 — Project Skeleton and Static Hosting

**Goal:** A minimal static web project exists, and we can serve `/web/index.html` locally.

**Steps:**
1. Create the `/web` folder and add placeholder `index.html` and `styles.css`.
2. Add a simple HTML page with a “Hello WebAR” placeholder to confirm the path is correct.
3. Add instructions in `README.md` for local dev:
    - Option A: Node `http-server`.

      Example (document this exactly):

          npm install -g http-server
          cd web
          http-server -p 8080

      Then open `http://localhost:8080` on the desktop browser.

    - Note: Camera access might require HTTPS on mobile; desktop testing can start with HTTP.

4. Commit these files with a message like:

    - `feat(door-ar): add basic web skeleton for MindAR app`

**Completion criteria:**
- `http://localhost:8080` opens and shows some placeholder text in the browser.

---

### Milestone 2 — Door Image Target Preparation

**Goal:** Have a proper **door image target** and compiled MindAR target file ready for use.

> Some of these steps require human involvement (taking a photo and running the MindAR image target compiler in a browser). The AI agent should generate the instructions and file paths; the human will drop the resulting files into the repo.

**Steps:**
1. Document in `docs/` or in this ExecPlan how to capture `door-reference.jpg`:
    - Take a full-frame photo of the door from a typical viewing angle.
    - Ensure good lighting and visible **high-contrast features** (handles, stickers, labels).
    - Avoid reflections and motion blur.

2. Place `door-reference.jpg` into `/web/assets/door-reference.jpg`.

3. Use MindAR Image Target Compiler:
    - In the documentation, include a link (to be filled by a human) where the MindAR official compiler runs (usually an online tool).
    - Human steps:
        - Open the compiler in a browser.
        - Upload `door-reference.jpg`.
        - Set it as target index 0.
        - Export the `.mind` file.

4. Add the exported file into the repo as:

    - `/web/assets/door-targets.mind`

5. Update `README.md` with a section:

    - “How to regenerate `door-targets.mind` if the door changes”

**Completion criteria:**
- `/web/assets/door-reference.jpg` and `/web/assets/door-targets.mind` are present.
- Instructions for regenerating the `.mind` file are clearly written.

---

### Milestone 3 — Implement AR Scene with MindAR + A-Frame

**Goal:** `index.html` uses MindAR to detect the door and overlay text instructions in AR.

**Steps:**
1. In `index.html`, load required scripts from CDNs:
    - A-Frame (e.g., 1.2.0 or newer).
    - MindAR core and A-Frame integration build.

2. Set up the base HTML structure:
    - Proper `<head>` with viewport meta tag for mobile.
    - Link to `styles.css`.
    - `<body>` containing an `<a-scene>` with `mindar-image` component.

3. Configure `a-scene`:

        <a-scene
          mindar-image="imageTargetSrc: ./assets/door-targets.mind;"
          color-space="sRGB"
          renderer="colorManagement: true, physicallyCorrectLights"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false">

          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

          <!-- more entities go here -->
        </a-scene>

4. Add an entity bound to the door target (index 0):

        <a-entity mindar-image-target="targetIndex: 0">
          <a-text
            value="ドアの使い方：\n1. カードキーをここにタッチ\n2. ランプが緑になったら開けてください"
            align="center"
            width="1.8"
            position="0 0 0"
            rotation="-90 0 0">
          </a-text>
        </a-entity>

5. Adjust text positioning:
    - `position` controls where the text appears relative to the door.
    - For example, move it slightly above the door center:

          position="0 0.4 0"

    - These values may require trial and error; document the chosen values and why they work.

6. Optional: Add a simple loading overlay in plain HTML (outside the `a-scene`):
    - A “Tap to start AR” button if required by iOS permission flow.
    - A short message explaining what will happen.

7. Style the page in `styles.css`:
    - Basic reset.
    - Font (e.g., system UI).
    - Centered instructions on top of the camera feed as needed.

**Completion criteria:**
- On a desktop browser with a webcam, when the webcam sees the printed door image (or the actual door), the text appears aligned with the door target.
- No runtime errors in the console.

---

### Milestone 4 — Mobile Validation (iPhone Safari)

**Goal:** Confirm that the experience works on **iPhone** and that a human can record a video.

**Steps:**
1. Deploy the `/web` folder to any HTTPS static host (e.g., Netlify, Vercel, GitHub Pages + Pages HTTPS).
    - Document in `README.md` exactly how to deploy (commands, branch, URL).
    - Example: For Netlify, mention drag-and-drop or `netlify deploy` instructions.

2. Open the hosted URL in **Safari on iPhone**.
    - Confirm camera permission dialog appears.
    - Grant permission.

3. Point the iPhone at the real door used for `door-reference.jpg`.
    - Verify that the text appears on top of the door.
    - Check that movement is reasonably stable.

4. Document how to record:
    - Use iOS screen recording:
        - Enable Control Center recording.
        - Start recording, then open Safari and perform the AR experience.
        - Stop recording and save the video.

5. Note any behavioral differences between desktop and iPhone:
    - Tracking stability.
    - Performance.
    - Field of view.

**Completion criteria:**
- Verified on at least one iPhone model that:
    - Camera opens.
    - Target door is recognized.
    - Text overlay appears.
    - A video can be recorded via screen recording.

---

### Milestone 5 — Extensibility (Optional / Future)

**Goal:** Make it easy to add more doors and different instructions without changing core logic each time.

**Steps:**
1. Decide a simple configuration format (for future work), e.g., JSON:

        assets/door-config.json
        [
          {
            "id": "room101-door",
            "targetIndex": 0,
            "title": "Room 101",
            "instructions": [
              "カードキーをリーダーにタッチ",
              "緑ランプが点灯したらドアを引いてください"
            ]
          }
        ]

2. Adjust `index.html` to:
    - Load the JSON via `<script>` tag or simple inline config for now.
    - Map `targetIndex` to displayed text.

3. Leave clear comments in the code and in `README.md` on:
    - How to add a second door.
    - Which index it should be in the `.mind` file.
    - How to update the config.

**Completion criteria:**
- The code has placeholders & comments so that future work to support multiple doors is straightforward.

---

## 4. Validation Strategy

We want **human-observable** evidence that the feature works.

**Validation checklist:**
- [ ] Desktop Chrome:
  - [ ] Open local `http://localhost:8080`.
  - [ ] Allow camera access.
  - [ ] Show the door image (on paper or screen) to the webcam.
  - [ ] Confirm that text appears only when the door is visible.
- [ ] iPhone Safari:
  - [ ] Open HTTPS URL (e.g., `https://door-ar.example.com`).
  - [ ] Camera permission dialog appears and is granted.
  - [ ] Door tracking works and text overlay appears.
  - [ ] Recording via screen recording produces a usable video.
- [ ] Responsiveness:
  - [ ] UI text is readable on small phone screens.
  - [ ] No overlap with browser UI elements.

**Logging / evidence:**
- Capture at least one screenshot (desktop) and one short iPhone video.
- Store links or file paths to these artifacts in the repo or in this ExecPlan’s “Artifacts” section.

---

## 5. Idempotence and Rollback

**Idempotence:**
- Running the local server multiple times should not change any files.
- Deploying the same `/web` contents to the host should be safe and repeatable.

**Rollback:**
- If the new AR feature breaks anything:
    - We can roll back to the previous commit where `/web` didn’t exist or contained only the skeleton page.
- Keep feature work in a separate branch, e.g., `feature/door-ar-overlay`, and merge via PR.

---

## 6. Progress Tracking (Template)

Use this section as a running log while executing the plan.

- [x] M1: Basic static site skeleton
  - [x] `/web/index.html` and `styles.css` created
  - [x] Local dev server instructions added
- [x] M2: Door image target ready
  - [x] `door-reference.jpg` captured and added
  - [x] `door-targets.mind` generated and added
- [x] M3: AR scene implemented
  - [x] MindAR + A-Frame integrated
  - [x] Text overlay appears on door target (awaiting human validation with camera)
- [ ] M4: Mobile validation
  - [x] Deployed to HTTPS host (Netlify)
  - [ ] Tested on iPhone Safari
  - [ ] Screen recording confirmed
- [ ] M5: Extensibility stubs
  - [ ] Config format sketched (JSON or inline)
  - [ ] Comments and docs added for multi-door

Add timestamps and notes as work progresses:

- `2025-11-20 12:22 JST` — Created `/web` skeleton with placeholder “Hello WebAR” and documented http-server local preview steps in README.md.
- `2025-11-20 12:29 JST` — Captured and added `web/assets/door-reference.jpg` (iPhone 17 Pro, 4284x5712) for MindAR compilation.
- `2025-11-20 12:45 JST` — Implemented MindAR + A-Frame AR scene in `web/index.html`; waiting on `door-targets.mind` to validate tracking.
- `2025-11-20 12:55 JST` — Added missing-target guard: “Start AR” stays disabled until `door-targets.mind` is present; README clarified regeneration steps.
- `2025-11-20 12:54 JST` — Compiled `web/assets/door-targets.mind` locally via offline compiler (`scripts/compile-mindar.mjs`) using tfjs-node; ready for live tracking test.
- `2025-11-20 13:05 JST` — Marked M3 implementation complete; camera validation still needed to close the validation checklist.
- `2025-11-20 13:15 JST` — Added HTTPS deployment instructions (Netlify CLI/UI and GitHub Pages) to enable iPhone Safari validation.
- `2025-11-20 13:20 JST` — Added `netlify.toml` (publish=web) so Netlify CLI can deploy without extra flags; hosting still pending.
- `2025-11-20 13:25 JST` — Hosting not executed (no Netlify auth configured); manual deploy remains required to start M4 validation.
- `2025-11-20 13:02 JST` — Deployment attempt via provided NETLIFY_AUTH_TOKEN failed (Netlify API returned 401 Access Denied); need a valid token to proceed.
- `2025-11-20 13:35 JST` — Deployed to Netlify production: https://door-usage-ar-20251120.netlify.app (unique: https://691e94835ac183801a0061af--door-usage-ar-20251120.netlify.app).
- `2025-11-20 13:10 JST` — Updated AR start flow with readiness/error messaging to help diagnose “camera not appearing” cases; redeployed to Netlify (unique: https://691e95e6468e4882d17a2585--door-usage-ar-20251120.netlify.app).
- `2025-11-20 13:18 JST` — Added explicit camera permission preflight (getUserMedia) before MindAR start; redeploy pending validation.
- `2025-11-20 13:22 JST` — Redeployed with camera preflight; latest unique: https://691e97474c4c4283f4c0b4c6--door-usage-ar-20251120.netlify.app.
- `2025-11-20 13:23 JST` — Surfaced getUserMedia error text in UI and expanded Safari permission reset steps; redeploy pending validation.
- `2025-11-20 13:23 JST` — Redeployed with error-text surface; latest unique: https://691e9911d467578ed3315a60--door-usage-ar-20251120.netlify.app.
- `2025-11-20 13:29 JST` — MindAR start now waits for system initialization (renderstart) before calling start(); redeployed (unique: https://691e9d12f8d3b8049b51dca8--door-usage-ar-20251120.netlify.app).
- `2025-11-20 13:54 JST` — Aligned overlay directly on target (removed auto tilt, set zero rotation, adjusted size); redeployed (unique: https://691e9f90f8d3b809d251dd8a--door-usage-ar-20251120.netlify.app).
- `2025-11-20 13:58 JST` — Enabled renderer alpha + embedded scene (to ensure video feed shows behind overlays); redeployed (unique: https://691ea0b332e98da84819b7d7--door-usage-ar-20251120.netlify.app).
- `2025-11-20 13:23 JST` — On iPhone Safari, camera permission prompt not appearing; suspect per-site camera blocked in Safari settings. Added troubleshooting steps to follow.
- `2025-11-20 14:16 JST` — Investigated missing overlay despite visible camera feed; updated MindAR runtime to 1.2.5, forced flat double-sided materials, and sized the embedded scene/canvas to full viewport with target found/lost status messaging.
- `2025-11-20 14:23 JST` — Redeployed to Netlify after overlay fixes; latest unique: https://691ea5b39eb1a6a705dbde1a--door-usage-ar-20251120.netlify.app.
- `2025-11-20 14:30 JST` — Camera feed not visible; root cause was MindAR video element sitting behind the body background. Made body transparent, forced the video to fill the viewport with higher z-index, and re-tagged the video element after start.
- `2025-11-20 14:31 JST` — Redeployed with video-layer fix; latest unique: https://691ea794d46757ad78315aa9--door-usage-ar-20251120.netlify.app.
- `2025-11-20 14:39 JST` — AR overlays not showing (target not detected). Relaxed MindAR tolerances and removed !important sizing overrides that conflicted with MindAR resizing; redeployed (unique: https://691ea95f4c4c42ab83c0b4e5--door-usage-ar-20251120.netlify.app).
- `2025-11-20 14:48 JST` — Overlays existed but not visible; increased scale, set rotation to face the camera, bumped render order, and disabled frustum culling on overlay objects to keep them in view when target is found.
- `2025-11-20 14:52 JST` — Redeployed overlay-orientation fix; latest unique: https://691eac3a9eb1a6b697dbdaff--door-usage-ar-20251120.netlify.app.
- `2025-11-20 14:56 JST` — Simplified overlay transforms (Z-offset only) and added console logging on targetFound for debugging; redeployed (unique: https://691eada3b565a3a139ee0ac3--door-usage-ar-20251120.netlify.app).
- `2025-11-20 15:05 JST` — Added detailed targetFound debug logging (camera, target, text, plane, renderer) to inspect state when detection fires; redeployed (unique: https://691eb9b3468e48d3cc7a255a--door-usage-ar-20251120.netlify.app).
- `2025-11-20 15:53 JST` — Ensured overlay entity visibility toggles on targetFound/targetLost; redeployed (unique: https://691ebaefcb30a2d32643e1dd--door-usage-ar-20251120.netlify.app).
- `2025-11-20 15:58 JST` — Restored detailed targetFound debug logging (camera/target/text/plane/renderer) per request; redeployed (unique: https://691ebbbf4c4c42d8cbc0b4aa--door-usage-ar-20251120.netlify.app).
- `2025-11-20 16:00 JST` — Lowered camera near clipping (0.01) and limited far to 1000 after MindAR start to prevent overlays from being clipped when target is close; redeployed (unique: https://691ebd5687d0b0c955495851--door-usage-ar-20251120.netlify.app).

---

## 7. Surprises & Discoveries (Log)

Use this to record any unexpected behavior or learnings:

- `2025-11-20 12:24 JST` — Repository is not initialized as a git repo (`.git` missing); file creation succeeded but commits will need repo setup later.
- `2025-11-20 12:45 JST` — AR scene wiring is in place, but tracking cannot start until `web/assets/door-targets.mind` is generated from the door photo.
- `2025-11-20 12:55 JST` — Added UI guard; Start AR remains disabled if the `.mind` file is missing, to avoid confusing users during setup.
- `2025-11-20 12:54 JST` — First compile attempt timed out using tfjs CPU backend; installing `@tensorflow/tfjs-node` sped up offline compilation and produced `door-targets.mind`.
- `2025-11-20 13:05 JST` — AR scene ready for validation; pending human test with camera to verify tracking stability and overlay alignment.
- `2025-11-20 13:15 JST` — Deployment remains manual; prepared Netlify/Pages instructions so validation on iPhone can proceed once hosted.
- `2025-11-20 13:20 JST` — Added `netlify.toml` (publish=web) to simplify Netlify CLI deploys; avoided adding automatic CI deploy to keep repo minimal.
- `2025-11-20 13:25 JST` — No hosting performed yet (no Netlify login configured in environment); need manual deploy before mobile validation.
- `2025-11-20 13:02 JST` — Provided NETLIFY_AUTH_TOKEN was rejected by Netlify API (401 Access Denied); deploy blocked until a valid token is supplied.
- `2025-11-20 13:35 JST` — Deployment succeeded to Netlify via CLI; site live at https://door-usage-ar-20251120.netlify.app.
- `2025-11-20 13:22 JST` — Redeployed with camera preflight; latest unique: https://691e97474c4c4283f4c0b4c6--door-usage-ar-20251120.netlify.app.
- `2025-11-20 13:23 JST` — Camera permission prompt not showing on iPhone Safari; likely per-site camera blocked. Pending on-device Safari settings adjustment.
- `2025-11-20 14:16 JST` — Overlay text not rendering; root cause traced to older MindAR CDN (1.2.2) plus single-sided standard materials. Updated runtime to 1.2.5, switched overlay materials to flat + double-sided, and ensured the AR canvas fills the viewport.
- `2025-11-20 14:30 JST` — Camera feed hidden; MindAR video was behind the body background due to z-index stacking. Set body background transparent, pinned the video to the viewport with a dedicated class, and bumped its z-index above the background.
- `2025-11-20 14:39 JST` — Target detection flaky; suspect MindAR resizing overrides and strict CF filter. Relaxed detection tolerances and removed CSS !important overrides to let MindAR handle sizing while keeping video/canvas layering explicit.
- `2025-11-20 14:48 JST` — Overlay drawn but edge-on/offscreen; rotated plane/text to face the camera, enlarged 25%, set renderOrder, and disabled frustum culling to prevent disappearing when the target is just reacquired.

Each entry should have:
- Date/time.
- What was observed.
- How we reproduced it.
- What we changed (if anything).

---

## 8. Decision Log

Record important design decisions and why we made them:

1. **Use WebAR (MindAR + A-Frame) instead of native iOS app**
   - Reason: Faster iteration, no App Store review, runs directly in Safari, easier for hackathon/POC.

2. **Use image tracking (door photo) instead of plane tracking**
   - Reason: We want to anchor instructions to a specific door, not just any vertical surface.

3. **Use a single HTML file (index.html) for now**
   - Reason: Simplicity; easier for an AI agent to reason about one file for AR logic.

4. **Place project at `/web` in repo root**
   - Reason: Repository started empty; this matches the ExecPlan target structure and keeps static hosting straightforward.

5. **Use an explicit “Start AR” overlay**
   - Reason: Ensures user gesture before camera activation (especially iOS), and provides quick instructions before entering AR.

6. **Disable Start AR when target file is missing**
   - Reason: Prevents confusing errors if `door-targets.mind` hasn’t been generated yet; surfaces a clear instruction to add it.

7. **Use offline compiler script with tfjs-node**
   - Reason: Local `.mind` generation needed; tfjs-node backend speeds compilation versus pure CPU tfjs in Node.

8. **Treat M3 as code-complete pending human validation**
   - Reason: Implementation is in place with compiled target; only camera verification is outstanding.

9. **Document HTTPS deployment paths (Netlify/Pages) instead of auto-deploy**
   - Reason: Keeps repo simple; empowers manual hosting for Safari validation without adding CI.

10. **Add `netlify.toml` with publish=web**
    - Reason: Streamlines Netlify CLI deploys while keeping the repo static-only.

11. **Defer hosting until credentials are available**
    - Reason: Environment lacks Netlify auth; manual deploy is required before iPhone Safari validation.

12. **Require valid Netlify personal access token for deploy**
    - Reason: Provided token was rejected (401); need a working PAT to hit Netlify API/CLI.

13. **iPhone Safari camera prompt may be blocked per-site**
    - Reason: User reports no prompt; Safari site settings can retain a deny state. Needs user-side permission reset.

14. **Align runtime with compiled targets and force visible overlay materials**
    - Reason: AR overlay disappeared while camera feed played; bumping MindAR runtime to 1.2.5 (matching compiled `.mind`) and using flat double-sided materials keeps text visible without relying on lighting or face orientation.

15. **Promote camera video above page background**
    - Reason: MindAR injects the video at z-index -2; a non-transparent body background hid the feed. We make the body transparent and force the video to fill the viewport with a dedicated class and higher stacking order.

Add more as they come up.

---

## 9. Artifacts

As work progresses, list final deliverables here with paths:

- `/web/index.html` — Main AR app.
- `/web/styles.css` — Styling.
- `/web/assets/door-reference.jpg` — Door photo used for tracking.
- `/web/assets/door-targets.mind` — MindAR image target file.
- (Optional) `/web/assets/door-config.json` — Configuration for multiple doors.
- `/scripts/compile-mindar.mjs` — Offline MindAR target compiler.
- `/netlify.toml` — Netlify config publishing the `/web` folder.

Also add:
- Link to the deployed URL.
- Paths to example recordings (or external links) showing the AR overlay in action.

---

## 10. Interfaces & Configuration

**External interfaces:**
- Browser access via URL (e.g., `https://door-ar.example.com`).
- Camera permission request from the browser.

**Configurable aspects:**
- Text content: For now, hard-coded in `a-text` value; later, move to JSON config.
- Target index: `mindar-image-target="targetIndex: 0"` for the first door.
- Visual styling: Font size, width, color (extend `a-text` attributes or CSS if needed).

---

## 11. Risks & Open Questions

**Risks:**
- Tracking quality might be unstable if the door has few features or changes (e.g., lighting, posters).
- Network connectivity required for first load (WebAR in browser).

**Open questions (for product/owner):**
- Do we need multilingual instructions (JP/EN) with a toggle?
- How many distinct doors do we want to support in the first version?
- Do we need analytics (e.g., how many times each door was viewed)?

These are not blockers for the first implementation but should be revisited once the basic overlay works.

---

## 12. Summary

By following this ExecPlan, an engineer or AI agent can:
- Set up a MindAR + A-Frame WebAR project.
- Use a real door as an image target.
- Display text instructions on top of the door when viewed through iPhone Safari.
- Validate the experience and capture video evidence.

The plan is intentionally small but complete: **one door, one overlay, end-to-end working flow**, with a clear path to extend later.

---

## 13. Outcomes & Retrospective

- `2025-11-20 12:22 JST` — Milestone 1 completed: static `/web` skeleton with placeholder page is live, and README documents the local http-server preview.
- `2025-11-20 12:45 JST` — AR scene built with MindAR + A-Frame; pending `door-targets.mind` to validate tracking and complete M2/M3.
- `2025-11-20 12:55 JST` — Added “missing target” guard and README note; Start AR stays disabled until `door-targets.mind` is present.
- `2025-11-20 12:54 JST` — `door-targets.mind` compiled locally via `scripts/compile-mindar.mjs` (tfjs-node); ready for live tracking validation.
- `2025-11-20 13:05 JST` — M3 implementation marked complete; awaiting human validation with camera to close the validation checklist.
- `2025-11-20 13:15 JST` — Deployment instructions prepared (Netlify/Pages) to enable M4 validation on iPhone Safari.
- `2025-11-20 13:20 JST` — Added `netlify.toml` (publish=web) to simplify Netlify deploys for M4 testing; hosting still manual/pending.
- `2025-11-20 13:25 JST` — Hosting not run in this environment; next action is a manual HTTPS deploy (e.g., Netlify) and on-device validation.
- `2025-11-20 13:02 JST` — Deploy attempt with provided NETLIFY_AUTH_TOKEN failed (401); need a valid token or login to proceed.
- `2025-11-20 13:35 JST` — Deployed to Netlify production: https://door-usage-ar-20251120.netlify.app (unique: https://691e94835ac183801a0061af--door-usage-ar-20251120.netlify.app).
