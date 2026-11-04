export const PLAYER_STATUS = {
  PAUSED: 'paused',
  PLAYING: 'playing',
};

/** Placeholder until PRODUCT.md open question 3 is decided. */
export const LOAD_ERROR_PLACEHOLDER = 'This track could not be loaded.';

/** HTMLAudioElement default. Temporary until PRODUCT.md open question 1 is decided. */
export const BROWSER_DEFAULT_VOLUME = 1;

export const ActionType = {
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
  TOGGLE_PLAY: 'TOGGLE_PLAY',
  SELECT_TRACK: 'SELECT_TRACK',
  SELECT_AND_PLAY: 'SELECT_AND_PLAY',
  SEEK: 'SEEK',
  TIME_UPDATE: 'TIME_UPDATE',
  DURATION_CHANGE: 'DURATION_CHANGE',
  SET_VOLUME: 'SET_VOLUME',
  SET_SEEKING: 'SET_SEEKING',
  TRACK_ENDED: 'TRACK_ENDED',
  LOAD_ERROR: 'LOAD_ERROR',
  CLEAR_LOAD_ERROR: 'CLEAR_LOAD_ERROR',
  SET_BUFFERING: 'SET_BUFFERING',
};

export function createInitialState(tracks) {
  const first = tracks[0];

  return {
    tracks,
    currentTrackId: first.id,
    status: PLAYER_STATUS.PAUSED,
    currentTime: 0,
    duration: null,
    volume: BROWSER_DEFAULT_VOLUME,
    loadError: null,
    isSeeking: false,
    isBuffering: false,
  };
}

export function playerReducer(state, action) {
  switch (action.type) {
    case ActionType.PLAY:
      return { ...state, status: PLAYER_STATUS.PLAYING, isBuffering: true };
    case ActionType.PAUSE:
      return { ...state, status: PLAYER_STATUS.PAUSED, isBuffering: false };
    case ActionType.TOGGLE_PLAY: {
      const nextPlaying = state.status !== PLAYER_STATUS.PLAYING;
      return {
        ...state,
        status: nextPlaying ? PLAYER_STATUS.PLAYING : PLAYER_STATUS.PAUSED,
        isBuffering: nextPlaying,
      };
    }
    case ActionType.SELECT_TRACK: {
      if (action.trackId === state.currentTrackId) {
        return state;
      }

      return {
        ...state,
        currentTrackId: action.trackId,
        currentTime: 0,
        duration: null,
        loadError: null,
        status: PLAYER_STATUS.PAUSED,
        isBuffering: false,
      };
    }
    case ActionType.SELECT_AND_PLAY:
      return {
        ...state,
        currentTrackId: action.trackId,
        currentTime: 0,
        duration: null,
        loadError: null,
        status: PLAYER_STATUS.PLAYING,
        isBuffering: true,
      };
    case ActionType.SEEK: {
      const time = Math.max(0, action.time);
      const max = Number.isFinite(state.duration) ? state.duration : time;
      return { ...state, currentTime: Math.min(time, max) };
    }
    case ActionType.TIME_UPDATE:
      if (state.isSeeking) {
        return state;
      }
      return { ...state, currentTime: action.time };
    case ActionType.DURATION_CHANGE:
      return { ...state, duration: action.duration };
    case ActionType.SET_VOLUME:
      return {
        ...state,
        volume: Math.min(1, Math.max(0, action.volume)),
      };
    case ActionType.SET_SEEKING:
      return { ...state, isSeeking: action.isSeeking };
    case ActionType.SET_BUFFERING:
      if (action.isBuffering && state.status !== PLAYER_STATUS.PLAYING) {
        return state;
      }
      return { ...state, isBuffering: action.isBuffering };
    case ActionType.TRACK_ENDED:
      return {
        ...state,
        status: PLAYER_STATUS.PAUSED,
        currentTime: 0,
        isBuffering: false,
      };
    case ActionType.LOAD_ERROR:
      return {
        ...state,
        status: PLAYER_STATUS.PAUSED,
        loadError: action.message,
        isBuffering: false,
      };
    case ActionType.CLEAR_LOAD_ERROR:
      return { ...state, loadError: null };
    default:
      return state;
  }
}
