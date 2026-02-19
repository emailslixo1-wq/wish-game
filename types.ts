
export type PlayerType = 'MAN' | 'WOMAN';

export enum TileType {
  START = 'START',
  FINISH = 'FINISH',
  CHALLENGE = 'CHALLENGE', // Standard challenge
  TRAP = 'TRAP',           // Volte casas
  BONUS = 'BONUS',         // Avance casas
  HE_PEDE = 'HE_PEDE',     // Ele pede algo
  SHE_PEDE = 'SHE_PEDE'    // Ela pede algo
}

export interface Tile {
  id: number;
  type: TileType;
  label: string;
}

export interface GameState {
  manPosition: number;
  womanPosition: number;
  currentTurn: PlayerType;
  isGameOver: boolean;
  winner: PlayerType | null;
  lastDiceRoll: number;
  isRolling: boolean;
  isProcessing: boolean; // Tracks turn movement before modal
  message: string;
  showModal: boolean;
  modalContent: {
    title: string;
    description: string;
    type: TileType;
  } | null;
}

export interface ChallengeResponse {
  challenge: string;
  instruction: string;
}
