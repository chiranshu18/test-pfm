import { MusicNoteIcon } from '../icons';
import SeekBar from '../SeekBar/SeekBar';
import TransportControls from '../TransportControls/TransportControls';
import VolumeControl from '../VolumeControl/VolumeControl';
import styles from './NowPlayingHeader.module.css';

export default function NowPlayingHeader({
  track,
  currentTime,
  duration,
  volume,
  loadError,
  isPaused,
  isBuffering,
  isFirst,
  isLast,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeekStart,
  onSeek,
  onSeekEnd,
  onVolumeChange,
}) {
  return (
    <header className={styles.header}>
      <img
        className={styles.artwork}
        src={track.thumbnailUrl}
        alt=""
        width={104}
        height={104}
      />
      <div className={styles.main}>
        <div className={styles.titleRow}>
          <div className={styles.meta}>
            <h1 className={styles.name}>{track.name}</h1>
            <p className={styles.composer}>{track.composer}</p>
          </div>
          <span className={styles.tag}>
            <MusicNoteIcon />
            Now Playing
          </span>
        </div>
        {loadError ? <p className={styles.error}>{loadError}</p> : null}
        <SeekBar
          currentTime={currentTime}
          duration={duration}
          onSeekStart={onSeekStart}
          onSeek={onSeek}
          onSeekEnd={onSeekEnd}
        />
        <div className={styles.controls}>
          <TransportControls
            isPaused={isPaused}
            isBuffering={isBuffering}
            isFirst={isFirst}
            isLast={isLast}
            onTogglePlay={onTogglePlay}
            onPrevious={onPrevious}
            onNext={onNext}
          />
          <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
        </div>
      </div>
    </header>
  );
}
