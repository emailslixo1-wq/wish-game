
import React from 'react';
import { Tile, TileType } from '../types';

interface TileComponentProps {
  tile: Tile;
  isOccupied: { man: boolean; woman: boolean };
  rowIndex: number;
  colIndex: number;
  rowLength: number;
}

const TileComponent: React.FC<TileComponentProps> = ({ tile, isOccupied, rowIndex, colIndex, rowLength }) => {
  const getStyle = () => {
    // Shared types
    if (tile.type === TileType.START) return 'bg-emerald-600 border-emerald-400 text-white';
    if (tile.type === TileType.FINISH) return 'bg-slate-900 border-white text-white font-black';
    
    // Neutral color scheme for unified track
    switch (tile.type) {
      case TileType.TRAP: return 'bg-rose-900 border-rose-400 text-rose-100';
      case TileType.BONUS: return 'bg-amber-600 border-amber-300 text-white';
      case TileType.HE_PEDE: return 'bg-blue-600 border-blue-300 text-white';
      case TileType.SHE_PEDE: return 'bg-purple-600 border-purple-300 text-white';
      case TileType.CHALLENGE: return 'bg-gray-800 border-gray-600 text-gray-200';
      default: return 'bg-gray-800 border-gray-600 text-gray-200';
    }
  };

  const getLabel = () => {
    switch(tile.type) {
      case TileType.TRAP: return 'VOLTE 2';
      case TileType.BONUS: return 'BÔNUS';
      case TileType.START: return 'INÍCIO';
      case TileType.FINISH: return 'FIM';
      default: return null;
    }
  };

  const showNumber = ![TileType.START, TileType.FINISH].includes(tile.type);
  
  // Determine arrow direction
  // Quina (corner) is where the row transitions to the next line
  const isReverseRow = rowIndex % 2 !== 0;
  // For normal rows: quina is at the end (last column)
  // For reverse rows: quina is at the start (first column after reverse)
  const isCorner = isReverseRow ? colIndex === 0 : colIndex === rowLength - 1;
  
  let arrowDirection = 'right';
  if (isReverseRow) {
    arrowDirection = isCorner ? 'down' : 'left';
  } else {
    arrowDirection = isCorner ? 'down' : 'right';
  }

  const ArrowIcon = () => {
    const iconClass = "w-5 h-5 opacity-60";
    
    if (arrowDirection === 'right') {
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    if (arrowDirection === 'left') {
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    if (arrowDirection === 'down') {
      return (
        <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`relative w-full aspect-square flex flex-col items-center justify-center border-2 rounded-lg shadow-inner transition-all duration-500 ${getStyle()}`}>
      {/* Main tile label */}
      <span className="text-sm md:text-base font-black text-center">
        {getLabel()}
      </span>
      
      {/* Tile number for special tiles */}
      {showNumber && (
        <span className="text-xs md:text-sm font-bold text-center opacity-75">
          #{tile.label}
        </span>
      )}
      
      {/* Direction arrow */}
      <div className="absolute bottom-1 right-1 text-white">
        <ArrowIcon />
      </div>
      
      {/* Man player indicator */}
      {isOccupied.man && (
        <div className="absolute top-0 left-0 w-10 h-10 rounded-full bg-blue-500 border-3 border-white flex items-center justify-center z-20 shadow-2xl animate-bounce shadow-blue-500/80 ring-2 ring-white ring-offset-1">
          <span className="text-sm text-white font-black">H</span>
        </div>
      )}
      
      {/* Woman player indicator */}
      {isOccupied.woman && (
        <div className="absolute top-0 right-0 w-10 h-10 rounded-full bg-pink-500 border-3 border-white flex items-center justify-center z-20 shadow-2xl animate-bounce shadow-pink-500/80 ring-2 ring-white ring-offset-1">
          <span className="text-sm text-white font-black">M</span>
        </div>
      )}
    </div>
  );
};

export default TileComponent;
