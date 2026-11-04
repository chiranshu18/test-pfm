import { useEffect } from 'react';
import {
  ActionType,
  LOAD_ERROR_PLACEHOLDER,
  PLAYER_STATUS,
} from './playerReducer';
import { usePlayer } from './usePlayer';

export function useAudioEngine(audioRef) {
  const { state, currentTrack, dispatch } = usePlayer();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return undefined;
    }

    const onTimeUpdate = () => {
      dispatch({ type: ActionType.TIME_UPDATE, time: audio.currentTime || 0 });
    };

    const onDurationChange = () => {
      if (Number.isFinite(audio.duration)) {
        dispatch({ type: ActionType.DURATION_CHANGE, duration: audio.duration });
      }
    };

    const onEnded = () => {
      audio.currentTime = 0;
      dispatch({ type: ActionType.TRACK_ENDED });
    };

    const onError = () => {
      dispatch({
        type: ActionType.LOAD_ERROR,
        message: LOAD_ERROR_PLACEHOLDER,
      });
    };

    const onWaiting = () => {
      dispatch({ type: ActionType.SET_BUFFERING, isBuffering: true });
    };

    const onPlaying = () => {
      dispatch({ type: ActionType.SET_BUFFERING, isBuffering: false });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadedmetadata', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('stalled', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.onerror = onError;

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadedmetadata', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('stalled', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.onerror = null;
    };
  }, [audioRef, dispatch]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      return;
    }

    if (audio.getAttribute('src') !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      audio.load();
    }
  }, [audioRef, currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (state.status === PLAYER_STATUS.PLAYING) {
      const playAttempt = audio.play();
      if (playAttempt) {
        playAttempt.catch((error) => {
          if (error?.name === 'AbortError') {
            return;
          }
        });
      }
      return;
    }

    audio.pause();
  }, [audioRef, state.status, state.currentTrackId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || state.isSeeking || !Number.isFinite(state.currentTime)) {
      return;
    }

    if (Math.abs((audio.currentTime || 0) - state.currentTime) > 0.35) {
      try {
        audio.currentTime = state.currentTime;
      } catch {
        // Not seekable until metadata is available.
      }
    }
  }, [audioRef, state.currentTime, state.isSeeking]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || typeof state.volume !== 'number') {
      return;
    }
    audio.volume = state.volume;
  }, [audioRef, state.volume]);
}
