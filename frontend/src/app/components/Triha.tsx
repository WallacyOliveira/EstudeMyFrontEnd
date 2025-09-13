"use client";
import {BookText} from "lucide-react";

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

// Componente principal das Trilhas
export default function Trilhas() {
    // Array de botões que representam as trilhas
    const buttons = [1, 2, 3, 4, 5];

    // Função que controla o clique nos botões
    interface ButtonClickHandler {
        (buttonIndex: number): void;
    }

    const handleButtonClick: ButtonClickHandler = (buttonIndex) => {
        // Apenas permite navegação se não estiver bloqueado
        if (buttonIndex < buttons.length - 2) {
            window.location.href = `game`; // redireciona para a página do curso
        }
    };

    return (
        <div className=" min-h-screen flex flex-col items-center pt-10">

            {/* Cabeçalho azul com título da seção e botão "GUIA" */}
            <div
                className="bg-blue-500 rounded-t-xl px-6 py-4 mb-12 shadow-md text-white w-[90%] max-w-3xl flex justify-between items-center">
                <div>
                    <p className="text-sm font-bold opacity-80">SEÇÃO 1, UNIDADE 1</p>
                    <h2 className="text-xl font-bold">Português</h2>
                </div>
                <button
                    className="flex items-center gap-2 border-2 border-white rounded-xl px-3 py-1 text-white font-bold">
                    <BookText className="w-4 h-4"/>
                    GUIA
                </button>
            </div>

            {/* Área das trilhas */}
            <div className="relative w-full max-w-3xl flex flex-col items-center gap-12 px-6">
                {/* Linha central vertical que conecta os botões */}
                <div className="absolute top-10 bottom-0 left-1/2 w-[2px] -translate-x-1/2"></div>

                {/* Renderiza cada botão da trilha */}
                {buttons.map((_, index) => {
                    const isLocked = index >= buttons.length - 2; // Últimos botões bloqueados
                    const isLeft = index % 2 === 0; // Alterna posição esquerda/direita

                    // Classes de estilo diferentes para botão desbloqueado ou bloqueado
                    const buttonClass = isLocked
                        ? "bg-blue-500 text-gray-400 cursor-not-allowed opacity-50 rounded-full"
                        : "bg-blue-500 text-yellow-300 cursor-pointer hover:bg-blue-600 hover:scale-105 rounded-full";

                    return (
                        <div
                            key={index}
                            className={`w-full flex items-center ${
                                isLeft ? "justify-start pl-60" : "justify-end pr-56"
                            }`}
                        >
                            <div className="relative flex flex-col items-center">
                                {/* Linha horizontal que conecta cada botão à linha vertical */}
                                <div className={`w-6 h-0.5 mb-2 ${isLeft ? "mr-auto" : "ml-auto"}`}></div>

                                {/* Tooltip especial no terceiro botão */}
                                {index === 2 && <TooltipStart/>}

                                {/* Botão da trilha */}
                                <button
                                    onClick={() => handleButtonClick(index)}
                                    disabled={isLocked} // bloqueia clique se necessário
                                    aria-disabled={isLocked} // acessibilidade
                                    className={`w-20 h-20 shadow-xl flex items-center justify-center text-xl font-bold rounded-circle
                    transform active:translate-y-1  active:shadow-inner transition-all duration-200
                    ${buttonClass}`}
                                >
                                    ★
                                </button>

                                {/* Texto abaixo do botão */}
                                <span className="mt-2 text-sm text-gray-600">
                  {isLocked ? "Bloqueado" : `Trilha ${index + 1}`}
                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

