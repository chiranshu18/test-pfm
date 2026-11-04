import { useContext } from 'react';
import { PlayerContext } from './playerContext';

export function usePlayer() {
  const value = useContext(PlayerContext);
  if (!value) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return value;
}
