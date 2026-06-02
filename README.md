# ✨ Zenith Habit Engine

<p align="center">
  <strong>A minimal, premium, offline-first habit tracker focused on consistency.</strong>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-111827?logo=react&logoColor=61DAFB">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-111827?logo=typescript&logoColor=3178C6">
  <img alt="TanStack Start" src="https://img.shields.io/badge/TanStack-Start-111827?logo=reactquery&logoColor=FF4154">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-111827?logo=tailwindcss&logoColor=38BDF8">
  <img alt="Capacitor" src="https://img.shields.io/badge/Capacitor-8-111827?logo=capacitor&logoColor=119EFF">
</p>
---

## 🌌 What is Zenith?

Zenith is a distraction-free habit engine that helps you create rituals, track streaks, and stay focused.  
It combines clean visuals, smooth interactions, and local-first persistence so your data stays with you.

## 🚀 Highlights

- 🧠 **Natural-language habit input**  
  Add habits with commands like: `Read 10 pages for 30 days` or `Meditate for 2 weeks`.
- 📊 **Progress intelligence**  
  Overall completion, daily status, streaks, and habit-level progress.
- 🧩 **Bento dashboard**  
  Elegant card layout for quick scanning and rapid updates.
- ✅ **Todo side panel**  
  Lightweight, persistent task list for quick action items.
- 📝 **Notes side panel**  
  Always-available scratchpad for ideas and reflections.
- 🌗 **Theme toggle**  
  Clean light/dark visual experience.
- 📴 **Offline-first persistence**  
  Habits, todos, and notes are saved locally using IndexedDB.
- 📱 **Mobile-ready**  
  Capacitor integration for Android workflows.

## 🧱 Tech Stack

- **Frontend:** React 19 + TypeScript
- **Routing/App runtime:** TanStack Router + TanStack Start
- **Styling/UI:** Tailwind CSS 4 + Radix UI primitives + Motion
- **State:** Zustand (persisted stores)
- **Storage:** IndexedDB (`localforage`-backed storage adapter)
- **Mobile:** Capacitor (Android)
- **Build tooling:** Vite

## ⚡ Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Run locally

```bash
npm run dev
```

### 3) Build for web

```bash
npm run build
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build production web assets |
| `npm run build:mobile` | Build mobile-targeted assets |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run android:sync` | Build mobile assets and sync Capacitor Android project |
| `npm run android:open` | Open Android project in Android Studio |
| `npm run android:apk` | Sync and build a debug APK |

## 🗂 Project Structure

```text
src/
  components/zenith/   # UI modules (dashboard, terminal, cards, panels)
  store/               # Zustand persisted stores (habits, todos, notes)
  lib/                 # Utilities (date helpers, habit parsing)
  routes/              # TanStack routes
```

## 🎯 Product Feel

Zenith is designed to feel calm, premium, and intentional:

- Minimal chrome
- Soft motion
- Fast interactions
- Focus-first information density

---

<p align="center">
  Built for discipline. Engineered for focus.
</p>
