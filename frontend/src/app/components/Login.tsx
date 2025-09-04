'use client';  // Necessário para habilitar hooks do React no Next.js

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import Logo from './Logo';
import {Button} from 'react-bootstrap';

const Login = () => {
    const router = useRouter(); // Hook para navegação programática

    // Estados para armazenar valores do formulário e controle de UI
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false); // Alterna visibilidade da senha

    // Função chamada ao submeter o formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita reload da página
        setErro(''); // Reseta mensagens de erro

        try {
            // Requisição POST para a API de login
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, senha}),
            });

            const data = await res.json();

            // Redireciona se login for bem-sucedido
            if (res.ok && data.sucesso) {
                router.push('/pages/menuTrilhas');
            } else {
                setErro(data.mensagem || 'Erro desconhecido'); // Exibe mensagem de erro
            }
        } catch (error) {
            setErro('Erro ao conectar com o servidor.');
            console.error(error);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-50 px-4 h-screen flex-col relative overflow-hidden bg-cover bg-center"
            style={{backgroundImage: `url('/img/background-image-login-register.png')`}} // Fundo de tela
        >
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">

                {/* Logo */}
                <div className="mb-6 text-center">
                    <img src="/svg/EstudeMyLogo.svg" alt="Logo" className="ml-11"/>
                </div>

                {/* Formulário de login */}
                <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                    {/* Campo de email */}
                    <div className="flex flex-col">
                        <label className="text-sm text-left">Email:</label>
                        <input
                            type="email"
                            placeholder="Digite seu endereço de email."
                            className="rounded-lg py-2 px-3 text-sm border border-gray-300 w-full"
                            required
                            value={email} // Valor controlado
                            onChange={(e) => setEmail(e.target.value)} // Atualiza estado
                        />
                    </div>

                    {/* Campo de senha com botão de mostrar/ocultar */}
                    <div className="flex flex-col relative">
                        <label className="text-sm mb-1 text-left">Senha:</label>
                        <div className="relative">
                            <input
                                type={mostrarSenha ? "text" : "password"} // Alterna tipo do input
                                placeholder="Digite sua senha"
                                className="w-full rounded-lg py-2 px-4 pr-10 text-sm border border-gray-300 bg-blue-100"
                                required
                                value={senha} // Valor controlado
                                onChange={(e) => setSenha(e.target.value)} // Atualiza estado
                            />
                            {/* Botão para mostrar/ocultar senha */}
                            <button
                                type="button"
                                onClick={() => setMostrarSenha(!mostrarSenha)} // Alterna estado
                                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-900"
                                title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                            >
                                {/* Ícones SVG mudam conforme estado */}
                                {mostrarSenha ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.964 9.964 0 012.41-4.042M6.112 6.112A9.967 9.967 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-3.522 4.932M3 3l18 18"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                        {/* Link para recuperação de senha */}
                        <a href="/pages/esquecisenha"
                           className="text-blue-600 hover:underline text-sm mb-1 text-left mt-sm-3">
                            Esqueceu sua senha?
                        </a>
                    </div>

                    {/* Exibe mensagens de erro */}
                    {erro && <p className="text-red-600 text-sm">{erro}</p>}

                    {/* Botão de login */}
                    <Button type="submit" variant="primary">
                        Login
                    </Button>
                </form>

                {/* Link para cadastro */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center"></div>
                <p className="text-center text-sm">
                    Não possui conta?{" "}
                    <a href="/pages/cadastro" className="text-blue-600 hover:underline">
                        Cadastrar-se
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login; // Exporta o componente para uso em outras páginas
