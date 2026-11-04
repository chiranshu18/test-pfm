import { ListIcon } from '../icons';
import PlaylistRow from '../PlaylistRow/PlaylistRow';
import styles from './PlaylistSection.module.css';

export default function PlaylistSection({
  tracks,
  currentTrackId,
  isBuffering,
  onRowClick,
}) {
  return (
    <section className={styles.section} aria-label="Playlist">
      <h2 className={styles.heading}>
        <span className={styles.headingIcon} aria-hidden="true">
          <ListIcon />
        </span>
        Playlist ({tracks.length})
      </h2>
      <div className={styles.list}>
        {tracks.map((track) => (
          <PlaylistRow
            key={track.id}
            track={track}
            isCurrent={track.id === currentTrackId}
            isBuffering={isBuffering && track.id === currentTrackId}
            onClick={() => onRowClick(track.id)}
          />
        ))}
      </div>
    </section>
  );
}
