
import React from 'react';
import { Tile, TileType } from './types';

const generateRomanticPath = (length: number, seed: number): Tile[] => {
  const path: Tile[] = [];
  path.push({ id: 0, type: TileType.START, label: 'Início' });
  
  for (let i = 1; i < length - 1; i++) {
    // Rigid rule: every house must have a challenge or trap.
    const rand = (Math.sin(seed + i) + 1) / 2; // Deterministic random-ish for sync paths
    let type: TileType;

    if (rand < 0.15) type = TileType.TRAP; // "Azar" (Volte casas)
    else if (rand < 0.25) type = TileType.BONUS; // "Bônus" (Avance)
    else if (rand < 0.50) type = TileType.HE_PEDE; // Visual only - no label
    else if (rand < 0.75) type = TileType.SHE_PEDE; // Visual only - no label
    else type = TileType.CHALLENGE;
    
    path.push({ id: i, type, label: `${i}` });
  }
  
  path.push({ id: length - 1, type: TileType.FINISH, label: 'FIM' });
  return path;
};

// Larger path to allow for the "snake" winding visual
export const PATH_LENGTH = 25;
export const UNIFIED_PATH = generateRomanticPath(PATH_LENGTH, 789);

export const ICONS = {
  DICE: (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="16" cy="16" r="1.5" />
      <circle cx="16" cy="8" r="1.5" />
      <circle cx="8" cy="16" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  ),
  HEART: (
    <svg className="w-16 h-16 text-red-600 heart-glow" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  )
};
