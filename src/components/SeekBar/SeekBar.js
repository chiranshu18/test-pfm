import { useRef } from 'react';
import { formatTime } from '../../player/formatTime';
import { ratioFromClientX } from '../../player/pointerRatio';
import styles from './SeekBar.module.css';

export default function SeekBar({
  currentTime,
  duration,
  onSeekStart,
  onSeek,
  onSeekEnd,
}) {
  const trackRef = useRef(null);
  const seekingRef = useRef(false);
  const safeDuration = duration > 0 ? duration : 0;
  const percent =
    safeDuration === 0 ? 0 : Math.min(100, (currentTime / safeDuration) * 100);

  function timeFromClientX(clientX) {
    return ratioFromClientX(trackRef.current, clientX) * safeDuration;
  }

  function handlePointerDown(event) {
    if (safeDuration <= 0) {
      return;
    }
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional.
    }
    seekingRef.current = true;
    onSeekStart();
    onSeek(timeFromClientX(event.clientX));
  }

  function handlePointerMove(event) {
    if (!seekingRef.current) {
      return;
    }
    onSeek(timeFromClientX(event.clientX));
  }

  function handlePointerUp(event) {
    if (!seekingRef.current) {
      return;
    }
    seekingRef.current = false;
    onSeekEnd(timeFromClientX(event.clientX));
  }

  return (
    <div className={styles.seek}>
      <div
        ref={trackRef}
        className={styles.track}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.floor(safeDuration)}
        aria-valuenow={Math.floor(currentTime)}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(safeDuration)}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
        <div className={styles.thumb} style={{ left: `${percent}%` }} />
      </div>
      <div className={styles.times}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
