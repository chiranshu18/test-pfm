import { useRef } from 'react';
import { PLAYER_STATUS } from '../../player/playerReducer';
import { useAudioEngine } from '../../player/useAudioEngine';
import { usePlayer } from '../../player/usePlayer';
import NowPlayingHeader from '../NowPlayingHeader/NowPlayingHeader';
import PlaylistSection from '../PlaylistSection/PlaylistSection';
import styles from './Player.module.css';

export default function Player() {
  const audioRef = useRef(null);
  const {
    state,
    currentTrack,
    isFirst,
    isLast,
    togglePlay,
    selectAndPlay,
    selectPrevious,
    selectNext,
    seek,
    setSeeking,
    setVolume,
  } = usePlayer();

  useAudioEngine(audioRef);

  function handleRowClick(trackId) {
    if (trackId === state.currentTrackId) {
      togglePlay();
      return;
    }
    selectAndPlay(trackId);
  }

  return (
    <article className={styles.card}>
      <audio
        ref={audioRef}
        className={styles.audio}
        preload="metadata"
      />
      <NowPlayingHeader
        track={currentTrack}
        currentTime={state.currentTime}
        duration={state.duration ?? currentTrack.duration}
        volume={state.volume}
        loadError={state.loadError}
        isPaused={state.status === PLAYER_STATUS.PAUSED}
        isBuffering={state.isBuffering}
        isFirst={isFirst}
        isLast={isLast}
        onTogglePlay={togglePlay}
        onPrevious={selectPrevious}
        onNext={selectNext}
        onSeekStart={() => setSeeking(true)}
        onSeek={seek}
        onSeekEnd={(time) => {
          seek(time);
          setSeeking(false);
        }}
        onVolumeChange={setVolume}
      />
      <PlaylistSection
        tracks={state.tracks}
        currentTrackId={state.currentTrackId}
        isBuffering={state.isBuffering}
        onRowClick={handleRowClick}
      />
    </article>
  );
}
