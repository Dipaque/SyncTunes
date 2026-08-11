# Changelog

All notable changes to this project will be documented in this file.

## [4.1.0] - 2026-08-11

### Added
- **Spotify-Style Pinned Songs Grid**: Upgraded the Pinned Songs section on the Home page with a toggleable view. Users can now switch between the default horizontal scroll and an authentic Spotify-style grid view (flush-left images, translucent gray cards, and hover-state play buttons).
- **Universal Caching Utility**: Created a reusable `IndexedDBHelper` class (`appCache`) using the Singleton pattern. It manages a single, unified database (`SyncAppDB`) and object store (`app_cache`) for the entire application, eliminating connection leaks and versioning conflicts.
- **Home Screen TTL Cache**: Implemented a 4-hour Time-To-Live (TTL) cache for the Home page. It uses language-aware keys (e.g., `home_data_kollywood`) to instantly fetch fresh data when a user changes their preferred language, while serving instant cached data otherwise.
- **Library "Stale-While-Revalidate" Cache**: Added IndexedDB caching to the Library page. It loads cached data instantly (hiding the loading spinner), fetches fresh API data in the background, and seamlessly updates the UI without interrupting the user.
- **Extended SongCard Menu**: Added "Pin", "View Album", and "Add to Playlist" actions to the context menu on individual song cards, utilizing the O(1) dictionary lookup for instant pinning.

### Changed
- **Smart Diffing for Library Writes**: Upgraded the Library cache logic to perform a JSON stringify diff-check against the background API response. It now skips IndexedDB writes and React state updates entirely if the user's library hasn't changed, massively reducing CPU/disk I/O.
- **Minified Player Layout Architecture**: Removed fragile absolute positioning (`bottom-[4rem]`) from the `MinifiedPlayer`. Wrapped it and the `Sidebar` in a unified `fixed flex-col` container so they automatically stack perfectly regardless of device screen size or padding.

### Fixed
- **Sidebar Layout Shifts**: Fixed a bug where switching between filled and outlined icons caused the text labels to jump up and down. Wrapped all Sidebar icons in a strict `h-7 w-7` bounding box to ensure pixel-perfect text alignment.
- **Artist Name Icon Squishing**: Fixed a flexbox issue where long artist or channel names would squeeze the `IoPerson` icon into an oval. Added `flex-shrink-0` to the icon and proper `truncate` classes to the text span.

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