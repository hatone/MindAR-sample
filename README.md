# Door Usage AR Overlay (MindAR + A-Frame)

This repo holds a WebAR experiment that overlays door usage instructions using MindAR image tracking and A-Frame.

## Local development (HTTP server)

Use a simple static server to preview the `/web` folder:

```
npm install -g http-server
cd web
http-server -p 8080
```

Then open `http://localhost:8080` in your desktop browser.  
Note: mobile camera access typically requires HTTPS; use this HTTP setup for quick desktop checks during development.

## Regenerate `door-targets.mind` (if the door changes)

1. Ensure the latest door photo is saved to `web/assets/door-reference.jpg` (full-frame, good lighting, high-contrast features visible).
2. Open the MindAR Image Target Compiler (e.g., https://hiukim.github.io/mind-ar-js-doc/tools/compile/).
3. Upload `door-reference.jpg`, set it as target index `0`, and export the `.mind` file.
4. Save the exported file as `web/assets/door-targets.mind` (overwrite the existing file if present).
5. Redeploy or restart your static server as needed; no build step is required.

### Local (offline) compilation option

You can also compile the `.mind` file locally using the offline compiler script (requires Node, installs `mind-ar` and `@tensorflow/tfjs-node`):

```
npm install
npm run compile:mind
```

This reads `web/assets/door-reference.jpg` and writes `web/assets/door-targets.mind`.

## Usage (AR preview)

1. Run the local server (see above) or host `/web` on HTTPS.
2. Open the page in a browser with camera support (Chrome desktop for quick checks, Safari on iPhone for real test).
3. When prompted, allow camera access. If on mobile, tap “Start AR” to begin the session.
4. Point the camera at the target door that matches `door-reference.jpg` (or a printed version) to see the overlaid instructions.

Notes:
- The AR scene expects `./assets/door-targets.mind` to exist; without it, tracking cannot start.
- HTTPS is required on iOS for camera access. Desktop HTTP works for initial layout checks.
- The “Start AR” button stays disabled if `door-targets.mind` is missing; generate it first using the steps above.

## Quick validation checklist

- Desktop: `http://localhost:8080` → allow camera → show the printed or on-screen `door-reference.jpg` → confirm text appears only when the target is visible.
- Mobile (iPhone Safari): host `/web` on HTTPS → allow camera → point at the real door → verify overlay stability; use iOS screen recording if needed.

## Deploy to HTTPS (for iPhone Safari)

Option A — Netlify (drag & drop):
- Build output is just the `web/` folder. Zip or drag `web` into the Netlify deploy UI. The published URL will serve `index.html` at the root.

Option B — Netlify CLI:
```
npm install -g netlify-cli
netlify deploy --dir=web --prod
```
This prompts you to pick a site and publishes HTTPS automatically.

Option C — GitHub Pages (manual):
- Create a repo and push this project.
- In repo settings, set Pages to serve from the `web/` directory (or a `gh-pages` branch containing `web` contents at root).
- Use the Pages URL on iPhone Safari to test.

Recording on iOS:
- Enable iOS Control Center recording, start recording, open the hosted URL in Safari, run the AR experience, then stop recording and save the video.

Note: `netlify.toml` is included and defaults `publish = "web"`, so `netlify deploy --prod` will pick up the right folder without extra flags.

Current production deploy:
- https://door-usage-ar-20251120.netlify.app
- Latest unique: https://691ec04488b6cfa6aee0dd4d--door-usage-ar-20251120.netlify.app

If camera permission prompt does not appear on iPhone Safari:
- Check Settings → Safari → Camera is set to “Allow”.
- In Safari, tap the “aA” icon → Website Settings → Camera → Allow.
- If blocked previously, close the tab, re-open the URL, and tap “Start AR” again.
- If still blocked, Settings → Safari → Advanced → Website Data → search `door-usage-ar-20251120.netlify.app` and remove, then reload.
