# Videomaker Portfolio

Personal video journal of Stefano D'Ambrosio: a collection of travel, adventure and videomaking experiments.
Built as a fast, static site with [Astro](https://astro.build), [React](https://react.dev) islands and [Tailwind CSS](https://tailwindcss.com).

## Features

- **Video-first layout**: autoplaying hero teaser with play/pause, mute and fullscreen controls, plus a masonry-style grid of projects.
- **Smooth page transitions**: Astro's client router with View Transitions. Grid tiles morph into the project page video, and the rest of the page fades with a blur. Respects `prefers-reduced-motion`.
- **No layout shift**: every video sits in a fixed-size box with a skeleton placeholder, so content never jumps while media loads.
- **Optimised fonts**: self-hosted, Latin-subset `woff2` files (~35 KB total), preloaded, with size-matched fallback fonts.
- **Custom cursor**: an animated cursor that reacts to videos and links.
- **Static output**: one page per video, generated at build time from `src/data/videos.ts`.

## Tech stack

| Area      | Tooling                                   |
| --------- | ----------------------------------------- |
| Framework | Astro 7 (static output, `ClientRouter`)   |
| UI        | React 19 islands                          |
| Styling   | Tailwind CSS 4 (`@tailwindcss/vite`), CSS |
| Language  | TypeScript                                |
| Packages  | pnpm                                      |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org) 22 or later
- [pnpm](https://pnpm.io) (`corepack enable` picks up the version pinned in `package.json`)

### Install and run

```bash
pnpm install
pnpm dev
```

The dev server runs at <http://localhost:4321>.

## Scripts

| Command        | Description                                         |
| -------------- | --------------------------------------------------- |
| `pnpm dev`     | Start the local dev server with hot reload          |
| `pnpm build`   | Type-check with `astro check`, then build to `dist/` |
| `pnpm preview` | Serve the production build locally                  |

## Project structure

```text
public/
├── fonts/            # Self-hosted woff2 subsets
├── videos/           # Video files (mp4)
└── *.svg             # Icons
src/
├── components/       # React islands (Header, Grid, Project, Cursor, Loader…)
├── data/             # Content: hero video and project list
├── layouts/          # PageLayout: <head>, router, nav and footer
├── pages/            # Home and dynamic /video/[slug] routes
├── scripts/          # Page transition definitions
└── styles/           # Global CSS, Tailwind theme, typography, transitions
```

## Adding a video

1. Put the `.mp4` in `public/videos/`.
2. Add an entry to `src/data/videos.ts`:

   ```ts
   {
     source: "/videos/my-trip.mp4",
     title: "My Trip",
     description: "Short description of the video.",
     preview: "/images/my-trip-preview.jpg",
     date: "01/08/2024 - 05/08/2024",
     link: "/video/my-trip",          // becomes the page URL
     youtube: "https://www.youtube.com/watch?v=…",
   }
   ```

3. Run `pnpm build`. A page is generated at `/video/my-trip`.

Keep videos web-optimised (H.264, ≤1080p, reasonable bitrate): they autoplay, so file size drives load time.

## License

Code is released under the [MIT License](LICENSE). The videos and other media are © Stefano D'Ambrosio and are not covered by the license.

## Author

**Stefano D'Ambrosio**: [GitHub](https://github.com/Stedamb)
