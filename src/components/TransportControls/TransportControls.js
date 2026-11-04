import BufferingSpinner from '../BufferingSpinner/BufferingSpinner';
import { NextIcon, PauseIcon, PlayIcon, PreviousIcon } from '../icons';
import styles from './TransportControls.module.css';

export default function TransportControls({
  isPaused,
  isBuffering,
  isFirst,
  isLast,
  onTogglePlay,
  onPrevious,
  onNext,
}) {
  const playLabel = isBuffering ? 'Buffering' : isPaused ? 'Play' : 'Pause';

  return (
    <div className={styles.transport}>
      <button
        type="button"
        className={styles.skip}
        aria-label="Previous"
        disabled={isFirst}
        onClick={onPrevious}
      >
        <PreviousIcon />
      </button>
      <button
        type="button"
        className={styles.play}
        aria-label={playLabel}
        aria-busy={isBuffering ? 'true' : undefined}
        onClick={onTogglePlay}
      >
        {isBuffering ? (
          <BufferingSpinner />
        ) : isPaused ? (
          <PlayIcon />
        ) : (
          <PauseIcon />
        )}
      </button>
      <button
        type="button"
        className={styles.skip}
        aria-label="Next"
        disabled={isLast}
        onClick={onNext}
      >
        <NextIcon />
      </button>
    </div>
  );
}
