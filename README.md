<div align="center">

<img src="./src/assets/svg/logo1-light.svg" width="250px" alt="GitCV" />

Turn your GitHub activity into a professional resume.

[![Live Demo](https://img.shields.io/badge/demo-gitcv--app.vercel.app-0f62fe?style=flat-square)](https://gitcv-app.vercel.app/)
[![License](https://img.shields.io/badge/license-Apache%202.0-393939?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/react-19-0f62fe?style=flat-square)](https://react.dev)
[![Vite](https://img.shields.io/badge/vite-8-393939?style=flat-square)](https://vitejs.dev)

</div>

---

## Overview

GitCV connects to a user's GitHub account and converts their public activity — profile data, repositories, languages, and contribution history — into a structured, shareable resume. The interface follows the [IBM Carbon Design System](https://carbondesignsystem.com/), prioritizing clarity, information density, and a consistent dark theme.

## Features

**Profile resume**
Aggregates profile metadata, top languages, top repositories, and activity metrics into a single resume view.

**Contribution panel**
Renders a full contribution calendar sourced from the GitHub GraphQL API, with configurable visual themes.

**Snapshot export**
Generates shareable, image-based summary cards (profile snapshot, contribution snapshot, banner) for social use.

**Developer search**
Looks up any public GitHub user and previews their stats without requiring authentication.

**GitHub OAuth**
Authentication is handled entirely through GitHub OAuth against a serverless backend; no passwords are stored.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite |
| UI system | IBM Carbon Design System (`@carbon/icons-react`), custom CSS |
| State | React hooks, `useSyncExternalStore` for cross-component sync |
| Data source | GitHub REST API, GitHub GraphQL API |
| Auth | GitHub OAuth, serverless backend (Node.js on Vercel) |
| Image export | `html-to-image` |
| Deployment | Vercel |

## Architecture

```
GitHub OAuth ──▶ Serverless API (Vercel) ──▶ Session cookie
                                                    │
GitHub REST / GraphQL ──▶ Custom hooks ──▶ React UI ──▶ Snapshot export
```

Data fetching is isolated in custom hooks (`useGithubStats`, `useGithubContributions`, `useUser`), each backed by an in-memory resource cache to avoid redundant API calls across components.

## Project structure

```
src/
├── components/     Shared and page-level UI components
├── hooks/          Data-fetching and state hooks
├── routes/         Route-level pages
├── services/       API clients (auth, users, news)
├── css/            Stylesheets per route/section
├── utils/          Formatting and cache helpers
└── assets/         Icons, logos, images
```

## Getting started

### Prerequisites
- Node.js 18 or later
- A GitHub OAuth App (for local authentication)

### Installation

```bash
git clone https://github.com/<your-org>/gitcv.git
cd gitcv
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment

The frontend expects the authentication and data API to be reachable at the URL configured in `src/services/auth.service.js` and `src/services/users.service.js`. Point these to your own backend deployment when running outside of the hosted environment.

## Deployment

The project is configured for Vercel via `vercel.json`, with a single-page rewrite rule so all routes resolve to the React app.

## License

Licensed under the [Apache License 2.0](LICENSE).

<div align="center">

GitCV | Your code. Your story.

</div>