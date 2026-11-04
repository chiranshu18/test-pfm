import { useRef } from 'react';
import { ratioFromClientX } from '../../player/pointerRatio';
import { SpeakerIcon } from '../icons';
import styles from './VolumeControl.module.css';

export default function VolumeControl({ volume, onVolumeChange }) {
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const percent = Math.min(100, Math.max(0, volume * 100));

  function volumeFromClientX(clientX) {
    return ratioFromClientX(trackRef.current, clientX);
  }

  function handlePointerDown(event) {
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional.
    }
    draggingRef.current = true;
    onVolumeChange(volumeFromClientX(event.clientX));
  }

  function handlePointerMove(event) {
    if (!draggingRef.current) {
      return;
    }
    onVolumeChange(volumeFromClientX(event.clientX));
  }

  function handlePointerUp(event) {
    if (!draggingRef.current) {
      return;
    }
    draggingRef.current = false;
    onVolumeChange(volumeFromClientX(event.clientX));
  }

  return (
    <div className={styles.volume}>
      <span className={styles.speaker} aria-hidden="true">
        <SpeakerIcon />
      </span>
      <div
        ref={trackRef}
        className={styles.track}
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
        <div className={styles.thumb} style={{ left: `${percent}%` }} />
      </div>
    </div>
  );
}
