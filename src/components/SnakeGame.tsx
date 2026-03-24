import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play, Pause, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black border-2 border-[#f0f] shadow-[4px_4px_0px_#0ff]">
      <div className="flex justify-between w-full px-2 font-sans text-[10px] tracking-tighter">
        <div className="flex items-center gap-2 text-[#0ff]">
          <span className="animate-pulse">DATA_HARVEST:</span>
          <span className="font-bold">{score.toString().padStart(6, '0')}</span>
        </div>
        <div className="text-[#f0f]">
          MAX_YIELD: {highScore.toString().padStart(6, '0')}
        </div>
      </div>

      <div 
        className="relative bg-[#111] border-2 border-[#0ff] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 16, 
          height: GRID_SIZE * 16,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* CRT Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30 opacity-20 bg-[radial-gradient(circle,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>
        
        {/* Snake */}
        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1 
            }}
            className={`border-[1px] border-black ${
              i === 0 
                ? 'bg-[#0ff] shadow-[0_0_8px_#0ff]' 
                : 'bg-[#0ff]/40'
            }`}
          />
        ))}

        {/* Food */}
        <div
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
          className="bg-[#f0f] animate-glitch shadow-[0_0_8px_#f0f]"
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-40 p-4 text-center"
            >
              {isGameOver ? (
                <>
                  <AlertTriangle size={32} className="text-[#f0f] mb-2 animate-bounce" />
                  <h2 className="text-lg font-bold text-[#f0f] mb-4 leading-none glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
                  <button 
                    onClick={resetGame}
                    className="px-4 py-2 bg-[#f0f] text-black font-bold text-xs hover:bg-[#0ff] transition-colors border-b-4 border-r-4 border-black active:border-0 active:translate-x-1 active:translate-y-1"
                  >
                    REBOOT_CORE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-[#0ff] mb-6 leading-none glitch-text" data-text="PROCESS_HALTED">PROCESS_HALTED</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="w-16 h-16 flex items-center justify-center bg-[#0ff] text-black border-4 border-black hover:bg-[#f0f] transition-all"
                  >
                    <Play size={32} fill="currentColor" />
                  </button>
                  <p className="mt-4 text-[#0ff]/60 text-[8px] uppercase tracking-widest">INPUT:SPACE_TO_RESUME</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-1 text-[#0ff]/40 text-[8px] font-mono uppercase text-center">
        <p>DIR_INPUT: ARROW_KEYS</p>
        <p>CMD_PAUSE: SPACE</p>
      </div>
    </div>
  );
}
