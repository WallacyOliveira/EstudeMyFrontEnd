"use client";
import { useState } from "react";
import { BookText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Componente de tooltip que aparece acima do botão "Começar"
function TooltipStart() {
    return (
        <div
            className="absolute -top-14 animate-float bg-white text-blue-500 px-4 py-1 rounded shadow-md text-2xl z-20
                before:content-[''] before:absolute before:bottom-[-6px] before:left-1/2 before:-translate-x-1/2 
                before:border-4 before:border-transparent before:border-t-white"
        
        >
            Começar
        </div>
    );
}

function TooltipDescricao({
  index,
  onStart,
  onClose,
}: {
  index : number
  onStart: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: [0.8, 1.1, 1], y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        scale: { type: "tween" },
        y: { type: "tween" },
        opacity: { type: "tween" },
      }}
      onClick={(e) => e.stopPropagation()} // não fecha ao clicar dentro
      className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-64 bg-blue-500 rounded-2xl shadow-2xl text-white p-4 z-50"
    >
      <p className="font-bold text-lg">DESCRIÇÃO</p>
      <p className="text-sm opacity-90 mb-3">Lição {index + 1}</p>
      <button
        onClick={onStart}
        className="bg-white text-blue-500 font-bold w-full py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all"
      >
        COMEÇAR +10 XP
      </button>
    </motion.div>
  );
}

export default function Trilhas() {
  const buttons = [1, 2, 3, 4, 5];
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);

  const handleButtonClick = (index: number) => {
    const isLocked = index >= buttons.length - 2;
    if (isLocked) return;
    setTooltipIndex(index);
  };

  const handleStart = () => {
    window.location.href = "game";
  };

  const closeTooltip = () => {
    setTooltipIndex(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-10">
      {/* Cabeçalho */}
      <div className="bg-blue-500 rounded-t-xl px-6 py-4 mb-12 shadow-md text-white w-[90%] max-w-3xl flex justify-between items-center">
        <div>
          <p className="text-sm font-bold opacity-80">SEÇÃO 1, UNIDADE 1</p>
          <h2 className="text-xl font-bold">Português</h2>
        </div>
        <button className="flex items-center gap-2 border-2 border-white rounded-xl px-3 py-1 text-white font-bold">
          <BookText className="w-4 h-4" />
          GUIA
        </button>
      </div>

      {/* Overlay só quando balão está aberto */}
      <AnimatePresence>
        {tooltipIndex !== null && (
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTooltip} // fecha ao clicar fora
          />
        )}
      </AnimatePresence>

      {/* Trilhas */}
      <div className="relative w-full max-w-3xl flex flex-col items-center gap-12 px-6">
        {buttons.map((_, index) => {
          const isLocked = index >= buttons.length - 2;
          const isLeft = index % 2 === 0;

          return (
            <div
              key={index}
              className={`w-full flex items-center ${
                isLeft ? "justify-start pl-56" : "justify-end pr-56"
              }`}
            >
              <div className="relative flex flex-col items-center">
                <button
                  onClick={() => handleButtonClick(index)}
                  disabled={isLocked}
                  aria-disabled={isLocked}
                  className={`w-20 h-20 shadow-[0_6px_0px_rgba(0,0,0,0.2)] flex items-center justify-center text-2xl font-bold rounded-circle
                    transform active:translate-y-1 active:shadow-[0_2px_0px_rgba(0,0,0,0.3)]
                    transition-all duration-150 ${
                      isLocked
                        ? "bg-blue-500 text-gray-400 opacity-50 cursor-not-allowed"
                        : "bg-blue-500 text-yellow-300 cursor-pointer hover:scale-105"
                    }`}
                >
                  ★
                </button>

                <AnimatePresence>
                  {tooltipIndex === index && !isLocked && (
                    <TooltipDescricao
                      index={index}
                      onStart={handleStart}
                      onClose={closeTooltip}
                    />
                  )}
                </AnimatePresence>

              </div>  
            </div>
          );
        })}
      </div>
    </div>
  );
}
