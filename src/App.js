import Player from './components/Player/Player';
import { playlist } from './data/playlist';
import PlayerProvider from './player/PlayerProvider';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.page}>
      <PlayerProvider tracks={playlist}>
        <Player />
      </PlayerProvider>
    </div>
  );
}

export default App;
