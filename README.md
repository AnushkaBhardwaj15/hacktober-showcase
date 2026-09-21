# Opensource × Hacktoberfest 2026 Showcase

> Official event landing page for **Opensource × Hacktoberfest 2026**, organized by the **ACM Student Chapter at Medi-Caps University** (Indore, India).

---

## Overview

**Opensource × Hacktoberfest 2026** is a live, practical online workshop designed to introduce university students and beginner developers to the open-source ecosystem, the Git/GitHub collaboration workflow, and the process of making their first meaningful pull request.

The website serves as the interactive digital hub for the event scheduled for **September 21, 2026 (6:00 PM – 8:00 PM IST)**, featuring guest speaker **Mr. Harsh Sahu** (Open Source Mentor & Software Engineer). It provides event registration, learning outcomes, an interactive 4-step Git simulator terminal, a live countdown clock, speaker spotlight, and event FAQs.

---

## Features

- **Dynamic Neubrutalism Design System**: High-contrast, bold visual design aligned with modern open-source event branding.
- **Three.js WebGL Shader Dissolve**: Custom GLSL fragment shader performing a dynamic cream noise/FBM dissolve on the hero canvas driven by scroll position.
- **Lenis Smooth Scroll & GSAP Integration**: Inertia-based smooth scrolling synchronized with GSAP ScrollTrigger for word-by-word headline reveals and parallax foliage movement.
- **Interactive Git Simulator**: Interactive bash terminal replica demonstrating the 4-step contribution lifecycle (`git clone`, `git checkout -b`, `git commit`, and `git push` for Pull Requests).
- **Live Event Countdown Clock**: Client-side countdown calculating days, hours, minutes, and seconds until September 21, 2026, 18:00 IST.
- **Speaker Spotlight & Interactive Q&A**: Speaker biography, discussion topics, and an interactive question box with instant client-side validation and Enter-key support.
- **Accessible FAQ Accordion**: Built with semantic HTML5 `<details>` and `<summary>` elements for zero-JavaScript, accessible disclosure widgets.
- **External Workshop Registration**: Seamlessly integrated with Google Forms for attendee registrations.
- **L7 Load Balancer Readiness**: Dedicated `/health.html` endpoint for container orchestration and load-balancer health checks.

---

## Tech Stack

- **Frontend**: Vanilla HTML5, Vanilla CSS3 (Custom Properties / Neubrutalism Tokens), Vanilla JavaScript (ES6+).
- **Libraries (via CDN)**:
  - [Three.js r128](https://threejs.org/) — WebGL 2D canvas shader rendering.
  - [GSAP 3.13.0](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/) — Scroll-driven animations and parallax.
  - [Lenis 1.3.11](https://lenis.darkroom.engineering/) — Hardware-accelerated smooth scrolling.
  - [Google Fonts](https://fonts.google.com/) — *Space Grotesk*, *Space Mono*, and *Plus Jakarta Sans*.
- **Backend**: None (100% static, client-side web application).
- **Database**: None (Stateless architecture; attendee registrations are managed via Google Forms).
- **Infrastructure / Deployment**:
  - Stateless static web hosting (compatible with Netlify, Cloudflare Pages, Vercel, GitHub Pages, AWS S3/CloudFront, Nginx Docker container).
  - Pre-configured headers in `_headers`, `vercel.json`, and `nginx.conf`.
- **Tooling**:
  - Node.js test runner (`node test/validate.js`).
  - Python Pillow for lossless image optimization.

---

## Architecture

```
User / Web Browser
        │
        ▼
   CDN / Edge Proxy (Cloudflare / Netlify / Vercel / Nginx)
        │
        ├──────────────────────────┬──────────────────────────┐
        │ [Cache: 1 Year Immutable]│ [Cache: 30 Days + SWR]   │ [Cache: 1 Hour + SWR]
        ▼                          ▼                          ▼
Static Media & Fonts          CSS & JS Assets            HTML Documents
  • img/*.webp (Optimized)      • style.css                • index.html
  • img/*.jpeg                  • script.js (Deferred)     • health.html
  • fonts/*.woff2
        │
        ▼
Browser Client Execution
  ├── HTML5 DOM Parsing (Non-blocking due to deferred scripts)
  ├── CSS Token System & content-visibility optimization
  ├── Lenis Smooth Scrolling Engine
  ├── Three.js WebGL FBM Dissolve (Render-on-demand + IntersectionObserver paused)
  ├── GSAP ScrollTrigger Parallax & Text Reveal
  └── Local DOM Interactions (Countdown clock, Git simulator, Q&A feedback)
        │
        ▼
External Services
  └── Google Forms (Secure Registration Portal)
```

- **Frontend**: Semantic HTML5 layout with high-performance CSS and modular JavaScript.
- **Backend / API**: Fully decentralized; the client application runs purely in the browser with zero custom server-side dependencies.
- **Authentication**: Public event page with no authentication layer required.
- **Caching**: Multi-tiered edge and browser caching configured via HTTP headers.
- **Asset Delivery**: Visual assets are compressed and served with immutable cache tags.
- **Health Checks**: `/health.html` provides an isolated, lightweight HTTP 200 probe for infrastructure load balancers.

---

## Project Structure

```
.
├── index.html              # Main event landing page (Semantic HTML5, deferred scripts, explicit dimensions)
├── style.css               # Core design tokens, Neubrutalism styling, responsive breakpoints
├── script.js               # Lenis, Three.js WebGL shader, GSAP scroll sync, countdown, simulator
├── health.html             # L7 health/readiness check endpoint for load balancers
├── _headers                # HTTP caching and security headers for Netlify & Cloudflare Pages
├── vercel.json             # Edge caching and routing headers configuration for Vercel
├── nginx.conf              # Production Nginx reverse-proxy and Docker container configuration
├── package.json            # Node.js project metadata, dev server, and verification scripts
├── test/
│   └── validate.js         # Automated test suite (syntax, asset verification, CLS, attributes)
├── img/
│   ├── _originals/         # Uncompressed source asset backup archive
│   ├── hero-bg.webp        # Compressed hero background (WebP, quality 82, ~690 KB)
│   ├── mask-1.webp         # Left decorative twig/leaf asset (WebP)
│   ├── mask-2.webp         # Right decorative twig/leaf asset (WebP)
│   ├── speaker.jpeg        # Speaker photograph (JPEG, optimized quality 85)
│   └── acm-logo.jpeg       # ACM Student Chapter logo (JPEG, optimized)
└── fonts/
    ├── PPWoodland-Bold.woff2       # Bundled local font asset
    └── PPWoodland-Ultralight.woff2 # Bundled local font asset
```

---

## Requirements

- **Local Development**:
  - Python 3.8+ (for local HTTP server) OR Node.js 18+ (with `npx serve`).
  - Any modern web browser supporting WebGL and ES6 (Chrome, Firefox, Safari, Edge).
- **Automated Verification**:
  - Node.js 18.0.0+ (for `npm test`).

---

## Environment Variables

Because this application is a completely static, client-side web application, **no server-side secrets or environment variables are required** to build or run the website.

If you deploy behind a custom domain or reverse proxy, configure the standard platform variables:

```bash
# Optional reverse proxy / domain binding
PORT=8080
HOST=0.0.0.0
```

---

## Local Development

### 1. Clone the repository
```bash
git clone https://github.com/acm-medicaps/hacktober-showcase.git
cd hacktober-showcase
```

### 2. Start the local development server
Using Python (built-in):
```bash
python3 -m http.server 8080
```
*Or using npm:*
```bash
npm run dev
```

### 3. Open the website
Navigate to [http://localhost:8080](http://localhost:8080) in your web browser.

### 4. Run automated checks
```bash
npm test
```

---

## Production Build

Because this website uses modern standards-compliant native HTML5, CSS3, and ES6+ JavaScript, **no transpilation or heavy bundler is required**.

1. Ensure all assets pass automated verification:
   ```bash
   npm test
   ```
2. Deploy the root directory directly to your static hosting platform or build into a container:
   ```bash
   docker build -t hacktober-showcase:latest -f - . <<EOF
   FROM nginx:alpine
   COPY . /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   EOF
   ```

---

## Database

- **Database Technology**: *Not Applicable* (No database is used; this is a stateless frontend landing page).
- **State Handling**: Registrations are persisted externally via Google Forms, offloading compliance, security, and persistence without local database complexity.

---

## API

The application communicates with no custom REST or GraphQL APIs. All user interactions (countdown, terminal simulation, speaker question feedback) are processed locally within the browser DOM.

External HTTP Navigation Endpoints:
- `GET https://docs.google.com/forms/d/e/1FAIpQLSfVWnQUFoQAjxw_t6rG9_u82SuNnUCAcvzN87ulPmwBnRnvXg/viewform` — Opens external attendee registration form.
- `GET /health.html` — Internal health probe returning HTTP 200 `OK`.

---

## Performance Architecture

Every performance optimization in this codebase is grounded in the repository's actual implementation:

1. **Original Image Formats Preserved**:
   - Original image assets and source formats are intentionally preserved: JPEG remains JPEG (`acm-logo.jpeg`, `speaker.jpeg`) and WebP remains WebP (`hero-bg.webp`, `mask-1.webp`, `mask-2.webp`).
   - No automated format transcoding (e.g. JPEG → WebP or JPEG → AVIF) is performed, preserving source file fidelity.
2. **Cumulative Layout Shift (CLS) Elimination**:
   - All `<img>` tags declare explicit `width` and `height` attributes, reserving layout aspect ratios before images finish downloading.
3. **Largest Contentful Paint (LCP) Acceleration**:
   - The hero background image declares `fetchpriority="high"` and `decoding="async"`, instructing the browser to prioritize network bandwidth for the main viewport asset.
4. **Off-Screen Image Lazy Loading**:
   - Below-the-fold assets (`img/speaker.jpeg`, footer logo) declare `loading="lazy"` and `decoding="async"`.
5. **Non-Blocking Script Execution**:
   - All 5 script dependencies (`gsap`, `ScrollTrigger`, `three`, `lenis`, and `script.js`) use the `defer` attribute, completely removing parser blocking from the HTML rendering pipeline.
6. **Resource Hints**:
   - `<link rel="dns-prefetch">` and `<link rel="preconnect">` added for `fonts.googleapis.com`, `fonts.gstatic.com`, `cdn.jsdelivr.net`, and `cdnjs.cloudflare.com`.
7. **WebGL Render Loop Optimization**:
   - Three.js WebGL rendering (`animateThree`) utilizes an `IntersectionObserver` to automatically pause rendering when `.hero` is scrolled out of the viewport.
   - Redraws are only executed when `scrollProgress` changes or during window resize (`needsRender` flag), eliminating continuous 60fps GPU/CPU battery drain while idle.
8. **Layout Thrashing Prevention**:
   - Window `resize` listeners consolidated and throttled using `requestAnimationFrame`.
9. **Eliminated Animation Tween Flooding**:
   - GSAP word reveal replaces allocating 33 new `gsap.to()` tweens per scroll tick with direct opacity style updates.
10. **Dead CSS Elimination**:
    - Purged over 220 lines of orphaned CSS classes for a deleted modal and digital ticket pass.
11. **CSS `content-visibility: auto`**:
    - Below-the-fold sections (`#takeaways`, `#simulator`, `#details`, `#faqs`, `.footer`) leverage `content-visibility: auto` with `contain-intrinsic-size: 800px`, allowing the browser engine to skip layout and paint calculations until users approach those sections.
12. **Load Balancer Readiness**:
    - Dedicated `/health.html` probe and completely stateless client-side execution.
13. **Edge Caching & HTTP Compression**:
    - Ready-to-deploy configurations for Netlify, Cloudflare Pages (`_headers`), Vercel (`vercel.json`), and Nginx (`nginx.conf`) with 1-year immutable caching for static media and Gzip/Brotli compression.

---

## Automated CI/CD & Deployments

### 1. GitHub Pages Deployment (`kirito` branch)
The website is configured for automated CI/CD deployment to GitHub Pages via `.github/workflows/deploy-pages.yml`:

- **Trigger Branch**: `kirito` (and `Kirito`)
- **Automation**: GitHub Actions automatically triggers a rebuild and redeployment on every `git push` to the `kirito` branch.
- **Manual Deployment**: Manual triggering is enabled via `workflow_dispatch` in the Actions tab.
- **Build Command**: `npm run build` (runs `node test/validate.js` to verify syntax, assets, and markup).
- **Build Output Directory**: `.` (the static site root directory containing `index.html`).
- **Required Repository Settings**: In **Settings → Pages**, the Build and deployment source is set to **GitHub Actions** (`build_type: workflow`).
- **Required Actions Permissions**: The workflow defines `contents: read`, `pages: write`, and `id-token: write`. No private API keys or secrets are required.

### 2. Vercel Production Rebuild & Refresh (`main` branch)
Whenever code is pushed or merged into `main`, `.github/workflows/deploy-vercel.yml` automatically validates and triggers a production refresh:

- **Trigger Branch**: `main`
- **Automation**: Triggers validation tests (`npm run build`) and refreshes production.
- **Vercel Integration Options**:
  - **Native Git Integration**: If the repository is connected to Vercel via GitHub App, Vercel automatically detects pushes to `main` and rebuilds the production deployment.
  - **Vercel Deploy Hook**: Add `VERCEL_DEPLOY_HOOK` secret to GitHub repository secrets to trigger instant webhook rebuilds.
  - **Vercel CLI**: Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets to build and deploy using Vercel CLI.

---

## Deployment

### Option A: Static Edge Hosting (Netlify / Cloudflare Pages / Vercel)
1. Push this repository to GitHub/GitLab.
2. Link the repository to your provider.
3. Build command: *(leave empty)*
4. Output directory: `.` (repository root).
5. Provider will automatically read `_headers` or `vercel.json` for caching rules and security headers.

### Option B: Docker / Nginx
1. Build the Docker image using the provided `nginx.conf`:
   ```bash
   docker build -t hacktober-showcase .
   docker run -d -p 80:80 --name hacktober-showcase hacktober-showcase
   ```
2. Configure your cloud load balancer (AWS ALB, Google Cloud HTTP(S) LB) health check path to `/health.html`.

### Scaling & Load Balancing Considerations
- Because the application is **100% stateless**, any number of instances can be spun up across multiple availability zones without session stickiness or shared disk volumes.
- Cloudflare or CloudFront CDN caching should be placed in front of Nginx to serve `img/*`, `style.css`, and `script.js` directly from edge caches.

---

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| **Three.js shader canvas not rendering** | Hardware acceleration disabled or WebGL blocked. | Enable hardware acceleration in browser settings; the hero background image remains visible underneath as a fallback. |
| **Countdown timer showing "00:00:00:00"** | Target event date has passed. | Check `startCountdown()` in `script.js` to verify or update the event timestamp (`2026-09-21T18:00:00+05:30`). |
| **Fonts look like default system fonts** | Blocked network connection to Google Fonts CDN. | Verify Internet connectivity to `fonts.googleapis.com` or serve fonts locally from `fonts/`. |
| **Smooth scroll feels sluggish on low-end devices** | Hardware limitation with smooth wheel emulation. | Lenis automatically respects `prefers-reduced-motion` settings in modern browsers. |

---

## Development Guidelines

1. **Preserve Stateless Architecture**: Never introduce local server session dependencies; keep all page state in the client DOM.
2. **Asset Discipline**: Always compress new images to WebP/AVIF format before committing. Never commit raw multi-megabyte PNGs or uncompressed originals directly to `img/`.
3. **Prevent CLS**: Every `<img>` tag must include explicit `width` and `height` attributes.
4. **Deferred Scripts**: Never remove the `defer` attribute from `<script>` tags in `index.html`.
5. **Continuous Verification**: Always run `npm test` before committing any changes to ensure all 23 performance and syntax checks pass.

---

## License & Credits

- Organized by the **ACM Student Chapter, Medi-Caps University**.
- Released under the [MIT License](LICENSE).
