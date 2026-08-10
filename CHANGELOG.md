# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0] - 2026-08-10

### Added
- **Unified Library Experience**: Created a rich `Library` page with tabbed navigation for Liked Songs, Artists, Albums/Playlists, and My Rooms.
- **Library Search & Filtering**: Added a local search bar to the Library with real-time, case-insensitive filtering across all active tabs and dynamic count displays.
- **Reusable Like Component**: Built `LikeEntity.jsx`, a reusable component with Instagram-style optimistic UI animations that automatically stays in sync across Solo and Jam modes.
- **Pinned Songs Feature**: Added O(1) dictionary-based pinning logic to `KebabButton` and a dedicated horizontal scroll section for Pinned Songs on the Home (`SoloView`) page.
- **Background Playback Support**: Integrated the browser Media Session API and a `react-youtube` visibility workaround to prevent aggressive browsers from pausing background tabs, enabling OS-level lock-screen controls.
- **Personalized Home Feed**: Added a Preferred Language selector (e.g., Kollywood, Bollywood, K-Pop) in Settings to drive customized YouTube Music API results on the Home page.
- **Queue Management Tools**: 
  - Added a "Past Songs Limit" setting (5, 10, 15, 20) for Solo Mode.
  - Added Shuffle and Play/Pause controls directly to Album Views and the Liked Songs tab.

### Changed
- **Advanced Playback Sync (Jam Mode)**: Redesigned the `onVideoEnd` and playback initialization logic. When a new user joins a Jam room mid-song, they now sync to the exact current second using `playedAt` timestamp calculations instead of starting from the beginning.
- **Smart Routing**: Refactored `SoloView` clicks into a centralized `handleRouting` function that dynamically detects item types (Album, Playlist, Artist, Song) and routes correctly in both Jam and Solo modes.
- **Utility Modernization**: 
  - Refactored `playSong` with industry-standard JSDoc typing and attached a `queueIndex` to prevent infinite loop bugs with duplicate songs.
  - Upgraded `shuffle` and `bulkQueue` to accept standardized configuration objects and context setters.
- **Auto-Suggest Isolation**: Strictly isolated YouTube Music Auto-Suggest logic to Solo Mode only. In Jam Mode, playback now properly stops when the queue ends.

### Fixed
- **Queue Drawer Crash**: Fixed a fatal `.findIndex` error by properly handling `JSON.parse` fallbacks for `localStorage` data strings.
- **Drag & Drop Alignment**: Fixed the Queue Drawer to visually hide "played" songs while converting relative UI indices back to absolute array indices so Drag-and-Drop functionality remains accurate.
- **UI De-syncs**: Fixed a bug where Bulk Queuing or Shuffling did not immediately reflect in the Queue Drawer by passing `setSongsList` directly into the utility functions.