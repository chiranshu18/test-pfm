import { formatTime } from '../../player/formatTime';
import BufferingSpinner from '../BufferingSpinner/BufferingSpinner';
import { PlayIcon } from '../icons';
import styles from './PlaylistRow.module.css';

export default function PlaylistRow({ track, isCurrent, isBuffering, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.row} ${isCurrent ? styles.current : ''}`}
      aria-current={isCurrent ? 'true' : undefined}
      onClick={onClick}
    >
      <span className={styles.indicator}>
        {isCurrent ? (
          isBuffering ? (
            <BufferingSpinner size="sm" />
          ) : (
            <PlayIcon />
          )
        ) : null}
      </span>
      <img
        className={styles.thumb}
        src={track.thumbnailUrl}
        alt=""
        width={40}
        height={40}
      />
      <div className={styles.meta}>
        <span className={styles.name}>{track.name}</span>
        <span className={styles.composer}>{track.composer}</span>
      </div>
      <span className={styles.duration}>{formatTime(track.duration)}</span>
    </button>
  );
}
