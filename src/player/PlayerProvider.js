import { useMemo, useReducer } from 'react';
import { PlayerContext } from './playerContext';
import { ActionType, createInitialState, playerReducer } from './playerReducer';

export default function PlayerProvider({ tracks, children }) {
  const [state, dispatch] = useReducer(playerReducer, tracks, createInitialState);

  const value = useMemo(() => {
    const currentIndex = state.tracks.findIndex(
      (track) => track.id === state.currentTrackId
    );
    const currentTrack = state.tracks[currentIndex] ?? state.tracks[0];
    const isFirst = currentIndex <= 0;
    const isLast = currentIndex >= state.tracks.length - 1;

    return {
      state,
      dispatch,
      currentTrack,
      currentIndex,
      isFirst,
      isLast,
      togglePlay() {
        dispatch({ type: ActionType.TOGGLE_PLAY });
      },
      selectAndPlay(trackId) {
        dispatch({ type: ActionType.SELECT_AND_PLAY, trackId });
      },
      selectPrevious() {
        if (isFirst) {
          return;
        }
        dispatch({
          type: ActionType.SELECT_AND_PLAY,
          trackId: state.tracks[currentIndex - 1].id,
        });
      },
      selectNext() {
        if (isLast) {
          return;
        }
        dispatch({
          type: ActionType.SELECT_AND_PLAY,
          trackId: state.tracks[currentIndex + 1].id,
        });
      },
      seek(time) {
        dispatch({ type: ActionType.SEEK, time });
      },
      setSeeking(isSeeking) {
        dispatch({ type: ActionType.SET_SEEKING, isSeeking });
      },
      setVolume(volume) {
        dispatch({ type: ActionType.SET_VOLUME, volume });
      },
    };
  }, [state]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
