'use client';

import Link from "next/link";
import {ChevronRightIcon, ChevronLeftIcon} from "lucide-react"; // Ícones para navegação
import {useRef} from "react";

// ===============================
// Dados do carrossel
// ===============================
const items = [
    {id: 1, title: "Português", image: "../img/port.png", description: "Substantivo"},
    {id: 2, title: "História", image: "../img/hist.png", description: "Nosso país"},
    {id: 3, title: "Banco de dados", image: "../img/bd.png", description: "Banco de dados relacional"},
    {id: 4, title: "Matemática", image: "../img/mate.png", description: "Logaritmo"},
    {id: 5, title: "Geografia", image: "../img/geo.png", description: "Paises americanos"},
    {id: 6, title: "Ciências", image: "../img/cienc.png", description: "Biologia"},
];

// ===============================
// Componente do item individual
// ===============================
function CarouselItem({item}: { item: (typeof items)[0] }) {
    return (
        <Link href={`/pages/trilha?id=${item.id}`}>
            <div
            className="bg-white p-3 rounded-2xl shadow-md text-center hover:scale-105 transition-transform min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[60vw] flex-shrink-0">
            {/* Imagem do curso */}
            <img
                src={item.image}
                alt={item.title}
                className="mx-auto max-w-30 max-h-24 min-w-28 min-h-24 object-contain mb-2 rounded-xl"
            />
            {/* Título do curso */}
            <h2 className="text-white font-semibold bg-amber-500 rounded px-2 py-1 text-xs md:text-sm truncate">
                {item.title}
            </h2>
            {/* Descrição */}
            <p className="text-xs text-black-500 mt-1">{item.description}</p>
        </div>
        </Link>
    );
}

// ===============================
// Componente do Carrossel
// ===============================
function Carrousel() {
    // Referência do container que permite scroll horizontal
    const scrollRef = useRef<HTMLDivElement>(null);

    // Função para mover o carrossel horizontalmente
    const scroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({left: offset, behavior: "smooth"});
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 rounded-xl w-full max-w-screen-xl mx-auto">
            {/* ===============================
          Barra de navegação do carrossel
          =============================== */}
            <div className="flex items-center gap-2 w-full">
                {/* Botão de scroll para a esquerda */}
                <button
                    onClick={() => scroll(-300)}
                    className="p-3 hover:bg-sky-50 rounded"
                >
                    <ChevronLeftIcon className="w-10 h-10"/>
                </button>

                {/* Container com scroll horizontal */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth w-full py-2"
                >
                    {items.map((item) => (
                        <CarouselItem key={item.id} item={item}/>
                    ))}
                </div>

                {/* Botão de scroll para a direita */}
                <button
                    onClick={() => scroll(300)}
                    className="p-3 hover:bg-sky-50 rounded"
                >
                    <ChevronRightIcon className="w-10 h-10"/>
                </button>
            </div>
        </div>
    );
}

export default Carrousel;

