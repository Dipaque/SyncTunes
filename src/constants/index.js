export const fontFamily = "Poppins,sans-serif"

// localStorage variable
export const localStorage_recentSearches = 'oqfinreruxz_rin'
export const localStorage_autoSuggest = 'fihijojwrtg';
export const localStorage_autoSuggestLimit = 'inoindinwq';
export const localStorage_fadeDuration = 'aqwerweinfibn';
export const localStorage_playerMode = 'qwerdcewrfuec';
export const localStorage_soloQueue = 'inqwefineur';
export const localStorage_currentPlaying = 'indfingwertr';
export const localStorage_pinSongs = 'rjnsingoiponc';
export const localStorage_syncPreferredLang = 'inibsdjbgkjb';

export const PLAYER_MODE = {
    SOLO: 'solo',
    JAM: 'jam'
}

export const autoSuggest = 'Auto Suggest'

// Dynamic Route Object
export const getRoutes = (isSolo) => ({
    HOME: '/home',
    EXPLORE: '/explore',
    PLAYER: isSolo ? '/player' : '/room/:id/player',
    SEARCH: isSolo ? '/search' : '/room/:id/search',
    ARTIST: isSolo ? '/artists/:artist' : '/room/:id/artists/:artist',
    ALBUM: isSolo ? '/albums/:album' : '/room/:id/albums/:album',
    PLAYLIST: isSolo ? '/playlists/:playlist' : '/room/:id/playlists/:playlist',
    CHAT: '/room/:id/chat', // Chat remains room-specific
    SETTINGS: '/settings',
    LIBRARY: '/library'
});

// API routes
export const userActivity_route = '/user-activity'
export const library_route = '/library'
export const music_route = '/music' 