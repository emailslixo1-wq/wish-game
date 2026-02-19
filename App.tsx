
import React, { useState, useMemo } from 'react';
import { GameState, TileType, PlayerType } from './types';
import { generatePath, PATH_LENGTH, ICONS } from './constants';
import TileComponent from './components/TileComponent';
import Modal from './components/Modal';
import { generateChallenge } from './services/challengesService';

const randomPlayer = (): PlayerType => Math.random() < 0.5 ? 'MAN' : 'WOMAN';

const App: React.FC = () => {
  // Generate a fresh random path for every new game
  const [gamePath, setGamePath] = useState(() => generatePath(PATH_LENGTH));

  const [state, setState] = useState<GameState>(() => {
    const first = randomPlayer();
    return {
      manPosition: 0,
      womanPosition: 0,
      currentTurn: first,
      isGameOver: false,
      winner: null,
      lastDiceRoll: 0,
      isRolling: false,
      isProcessing: false,
      message: `Sorte decidiu! ${first === 'MAN' ? 'O Homem' : 'A Mulher'} começa. Preparem o clima.`,
      showModal: false,
      modalContent: null,
    };
  });

  const restartGame = () => {
    const first = randomPlayer();
    setGamePath(generatePath(PATH_LENGTH));
    setState({
      manPosition: 0,
      womanPosition: 0,
      currentTurn: first,
      isGameOver: false,
      winner: null,
      lastDiceRoll: 0,
      isRolling: false,
      isProcessing: false,
      message: `Sorte decidiu! ${first === 'MAN' ? 'O Homem' : 'A Mulher'} começa. Preparem o clima.`,
      showModal: false,
      modalContent: null,
    });
  };

  // Layout: A grid that snakes back and forth
  const gridLayout = useMemo(() => {
    const cols = 5;
    const rows = Math.ceil(PATH_LENGTH / cols);
    const layout = [];

    for (let r = 0; r < rows; r++) {
      const rowData = [];
      const isReverse = r % 2 !== 0;
      for (let c = 0; c < cols; c++) {
        const index = r * cols + c;
        if (index < PATH_LENGTH) {
          rowData.push(index);
        }
      }
      if (isReverse) rowData.reverse();
      layout.push(rowData);
    }
    return layout;
  }, []);

  const rollDice = () => {
    // Strictly prevent rolling if any part of a turn is active
    if (state.isRolling || state.isProcessing || state.showModal || state.isGameOver) return;

    setState(prev => ({ 
      ...prev, 
      isRolling: true, 
      isProcessing: true,
      message: 'Girando os dados da paixão...' 
    }));

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      processTurn(roll);
    }, 1200);
  };

  const processTurn = async (roll: number) => {
    const isMan = state.currentTurn === 'MAN';
    const currentPos = isMan ? state.manPosition : state.womanPosition;
    let nextPos = Math.min(PATH_LENGTH - 1, currentPos + roll);

    // Animate movement, advancing one house at a time
    let currentStep = currentPos;
    const stepDuration = 200; // milliseconds per house

    setState(prev => ({
      ...prev,
      isRolling: false,
      lastDiceRoll: roll,
      message: 'Movendo na trilha...'
    }));

    // Animate step by step
    const moveInterval = setInterval(() => {
      currentStep += 1;
      
      setState(prev => ({
        ...prev,
        [isMan ? 'manPosition' : 'womanPosition']: currentStep
      }));

      if (currentStep >= nextPos) {
        clearInterval(moveInterval);
        
        // Check if reached the end
        if (nextPos === PATH_LENGTH - 1) {
          setState(prev => ({
            ...prev,
            isGameOver: true,
            winner: state.currentTurn,
            showModal: true,
            isProcessing: false,
            modalContent: {
              title: "💖 NOITE INESQUECÍVEL",
              description: `O(A) ${isMan ? 'Homem' : 'Mulher'} chegou ao fim! A noite está apenas começando...`,
              type: TileType.FINISH
            }
          }));
          return;
        }

        // Execute challenge after reaching destination
        setTimeout(async () => {
          const tile = gamePath[nextPos];
          let finalNextPos = nextPos;
          let preMsg = "";

          if (tile.type === TileType.TRAP) {
            finalNextPos = Math.max(0, nextPos - 2);
            preMsg = "💔 AZAR! Volte 2 casas após o desafio. ";
          } else if (tile.type === TileType.BONUS) {
            finalNextPos = Math.min(PATH_LENGTH - 1, nextPos + 2);
            preMsg = "✨ BÔNUS! Avance 2 casas após o desafio. ";
          }

          const challenge = await generateChallenge(state.currentTurn, nextPos, tile.type);

          setState(prev => ({
            ...prev,
            [isMan ? 'manPosition' : 'womanPosition']: finalNextPos,
            showModal: true,
            isProcessing: false,
            modalContent: {
              title: challenge.challenge,
              description: `${preMsg}${challenge.instruction}`,
              type: tile.type
            }
          }));
        }, 500);
      }
    }, stepDuration);
  };

  const closeModal = () => {
    setState(prev => ({
      ...prev,
      showModal: false,
      modalContent: null,
      currentTurn: prev.isGameOver ? prev.currentTurn : (prev.currentTurn === 'MAN' ? 'WOMAN' : 'MAN'),
      message: prev.isGameOver ? 'Fim do Jogo' : `Vez do(a) ${prev.currentTurn === 'MAN' ? 'Mulher' : 'Homem'}`
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-48">
      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-4">
          {ICONS.HEART}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="romantic-font text-white text-lg font-black leading-tight text-center pt-1 drop-shadow-lg">
              Jogo da<br/>Sedução
            </h2>
          </div>
        </div>
        <div className="bg-black/30 px-6 py-2 rounded-full border border-red-900 shadow-xl">
           <p className="text-red-200 font-bold tracking-widest uppercase text-xs">{state.message}</p>
        </div>
      </div>

      <div className="bg-red-950/40 p-3 md:p-6 rounded-[2rem] border-4 border-red-900/50 shadow-2xl relative">
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {gridLayout.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-5 gap-3 md:gap-4">
              {row.map((idx, colIdx) => (
                <TileComponent 
                  key={idx}
                  tile={gamePath[idx]} 
                  isOccupied={{
                    man: state.manPosition === idx,
                    woman: state.womanPosition === idx
                  }}
                  rowIndex={rIdx}
                  colIndex={colIdx}
                  rowLength={row.length}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-10 left-0 right-0 flex justify-center px-6 z-50 pointer-events-none">
        <div className="glass-morphism pointer-events-auto w-full max-w-xl p-5 rounded-[2.5rem] flex items-center justify-between gap-6 border-2 border-red-900/40 shadow-2xl">
          
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl transition-all duration-500 ${
              state.currentTurn === 'MAN' ? 'bg-blue-600 rotate-2' : 'bg-pink-600 -rotate-2'
            }`}>
              {state.currentTurn === 'MAN' ? '♂' : '♀'}
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] font-black text-red-300 uppercase tracking-widest">Turno de</span>
              <p className={`font-black leading-none text-lg ${state.currentTurn === 'MAN' ? 'text-blue-300' : 'text-pink-300'}`}>
                {state.currentTurn === 'MAN' ? 'HOMEM' : 'MULHER'}
              </p>
            </div>
          </div>

          <button
            onClick={rollDice}
            disabled={state.isRolling || state.isProcessing || state.showModal || state.isGameOver}
            className={`group flex-1 h-16 rounded-3xl font-black text-lg transition-all active:scale-95 disabled:grayscale disabled:opacity-40 shadow-2xl text-white ${
              state.currentTurn === 'MAN' ? 'bg-blue-800 shadow-blue-900/50' : 'bg-pink-800 shadow-pink-900/50'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
               <span className={state.isRolling ? 'rolling-3d' : 'group-hover:rotate-12 transition-transform'}>
                 {ICONS.DICE}
               </span>
               <span className="tracking-tighter">
                {state.isRolling ? 'SORTEANDO...' : state.isProcessing ? 'MOVENDO...' : 'LANÇAR DADO'}
               </span>
            </div>
          </button>

          <div className="flex items-center gap-4">
             <div className="bg-black/40 w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl text-red-200 border border-red-900">
               {state.lastDiceRoll || '—'}
             </div>
             {state.isGameOver && (
               <button onClick={restartGame} className="bg-white text-red-900 p-3 rounded-2xl hover:bg-red-100 shadow-lg">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
               </button>
             )}
          </div>
        </div>
      </footer>

      <div className={`${state.showModal ? 'block' : 'hidden'} fixed inset-0 z-[100]`}>
        <div className="absolute inset-0 bg-red-950/70 backdrop-blur-lg"></div>
        <div className="relative h-full flex items-center justify-center p-6">
          <div className="modal-enter w-full max-w-md">
            <Modal 
              isOpen={state.showModal}
              title={state.modalContent?.title || ""}
              description={state.modalContent?.description || ""}
              type={state.modalContent?.type}
              onClose={closeModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
