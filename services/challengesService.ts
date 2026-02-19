import challenges from '../data/challenges.json';
import { ChallengeResponse, PlayerType } from '../types';

const asAny: any = challenges;

export const generateChallenge = async (player: PlayerType, tileId: number, type: string): Promise<ChallengeResponse> => {
  const desiredType = typeof type === 'string' ? type : String(type);

  // Filter by tile type and player
  const pool = asAny.filter((c: any) => {
    if (!c.type || !c.player) return false;
    
    // Check if player matches (either specific to player or BOTH)
    const isPlayerMatch = c.player === player || c.player === 'BOTH';
    if (!isPlayerMatch) return false;
    
    // Check if tile type matches
    if (desiredType === 'TRAP' && c.type === 'TRAP') return true;
    if (desiredType === 'BONUS' && c.type === 'BONUS') return true;
    if (desiredType !== 'TRAP' && desiredType !== 'BONUS') return c.type === 'NEUTRAL';
    return false;
  });

  const candidates = pool.length > 0 ? pool : asAny.filter((c: any) => c.player === player || c.player === 'BOTH');
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];

  return {
    challenge: chosen.challenge || 'Desafio Especial',
    instruction: chosen.instruction || 'Faça algo carinhoso com seu parceiro(a).'
  };
};
