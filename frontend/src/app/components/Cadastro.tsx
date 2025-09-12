"use client";

import {useState} from "react";
import Button from "react-bootstrap/Button";
import Logo from "./Logo";

// Componente principal de cadastro
const Cadastrar = () => {
    // ===============================
    // Estados do componente
    // ===============================
    const [tipoUsuario, setTipoUsuario] = useState<"aluno" | "professor" | "">("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenhas, setMostrarSenhas] = useState(false);
    const [erro, setErro] = useState("");      // Mensagem de erro
    const [registro, setRegistro] = useState(""); // Registro profissional do professor
    const [titulacao, setTitulacao] = useState(""); // Titulação do professor

    // ===============================
    // Função de envio do formulário
    // ===============================
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Previne reload da página
        setErro("");        // Limpa mensagens de erro anteriores

        // Validação de senha
        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        // Validação de tipo de usuário
        if (!tipoUsuario) {
            setErro("Selecione o tipo de usuário.");
            return;
        }

        try {
            // Monta os dados básicos
            const dadosBasicos: {
                nome: string;
                email: string;
                senha: string;
                tipoUsuario: "aluno" | "professor";
                registro?: string;
                titulacao?: string;
            } = {nome, email, senha, tipoUsuario};

            let dadosCompletos = {...dadosBasicos};

            // Campos adicionais para professor
            if (tipoUsuario === "professor") {
                dadosCompletos = {
                    ...dadosCompletos,
                    registro,
                    titulacao
                };
            }

            // Chamada à API de cadastro
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dadosCompletos),
            });

            const data = await res.json();

            if (!res.ok) {
                setErro(data.mensagem || "Erro no cadastro");
                return;
            }

            // Redireciona para a página de login após sucesso
            console.log("Resposta da API:", data);
            window.location.href = "/pages/login";
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            setErro("Erro ao conectar com o servidor.");
        }
    };

    // ===============================
    // Reseta os campos do formulário
    // ===============================
    const resetarFormulario = () => {
        setNome("");
        setEmail("");
        setSenha("");
        setConfirmarSenha("");
        setRegistro("");
        setErro("");
    };

    // ===============================
    // Ao alterar tipo de usuário
    // ===============================
    const handleTipoUsuarioChange = (tipo: "aluno" | "professor") => {
        setTipoUsuario(tipo);
        resetarFormulario(); // Limpa campos ao trocar
    };

    // ===============================
    // Renderização do componente
    // ===============================
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-50 px-4 h-screen flex-col relative overflow-hidden bg-cover bg-center"
            style={{
                backgroundImage: `url('/img/background-image-login-register.png')`,
            }}
        >
            {/* Container do formulário */}
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">

                {/* Logo */}
                <div className="mb-6 text-center">
                    <img src="/svg/EstudeMyLogo.svg" alt="Logo" className="ml-11"/>
                </div>

                {/* Seletor de tipo de usuário */}
                <div className="mb-6">
                    <h5 className="text-lg font-semibold mb-3 text-center text-gray-800">
                        Selecione o tipo de cadastro:
                    </h5>
                    <div className="flex gap-4 justify-center">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="tipoUsuario"
                                value="aluno"
                                checked={tipoUsuario === "aluno"}
                                onChange={() => handleTipoUsuarioChange("aluno")}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Aluno</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="tipoUsuario"
                                value="professor"
                                checked={tipoUsuario === "professor"}
                                onChange={() => handleTipoUsuarioChange("professor")}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Professor</span>
                        </label>
                    </div>
                </div>

                {/* Formulário só aparece após escolher tipo de usuário */}
                {tipoUsuario && (
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                        {/* Campos básicos: Nome e Email */}
                        <div className="flex flex-col">
                            <label className="text-sm mb-1 text-left text-black">
                                Nome Completo:
                            </label>
                            <input
                                type="text"
                                placeholder="Seu nome completo."
                                className="rounded-lg py-2 px-4 text-sm border-1 border-gray-400 bg-gray-100"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />

                            <label className="text-sm mb-1 text-left">Email:</label>
                            <input
                                type="email"
                                placeholder="Seu endereço de email."
                                className="rounded-lg py-2 px-4 text-sm border-1 border-gray-400 bg-gray-100"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Campos específicos do Professor */}
                        {tipoUsuario === "professor" && (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-sm mb-1 text-left text-black">
                                        Registro Profissional:
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Número do registro profissional."
                                        className="rounded-lg py-2 px-4 text-sm border-1 border-gray-400 bg-gray-100"
                                        required
                                        value={registro}
                                        onChange={(e) => setRegistro(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm mb-1 text-left text-black">
                                        Titulação:
                                    </label>
                                    <select
                                        className="rounded-lg py-2 px-4 text-sm border-1 border-gray-400 bg-gray-100"
                                        required
                                        value={titulacao}
                                        onChange={(e) => setTitulacao(e.target.value)}
                                    >
                                        <option value="">Selecione a titulação</option>
                                        <option value="graduacao">Graduação</option>
                                        <option value="especializacao">Especialização</option>
                                        <option value="mestrado">Mestrado</option>
                                        <option value="doutorado">Doutorado</option>
                                        <option value="pos_doutorado">Pós-Doutorado</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Senha e Confirmar Senha com toggle de visibilidade */}
                        <label className="text-sm mb-1 text-left">Senha:</label>
                        <div className="relative">
                            <input
                                type={mostrarSenhas ? "text" : "password"}
                                placeholder="Digite sua senha."
                                className="w-full rounded-lg py-2 px-4 pr-10 text-sm border-1 border-gray-400 bg-gray-100"
                                required
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                            {/* Botão de mostrar/ocultar senha */}
                        </div>

                        <label className="text-sm mb-1 text-left">Repita sua Senha:</label>
                        <div className="relative">
                            <input
                                type={mostrarSenhas ? "text" : "password"}
                                placeholder="Digite sua senha novamente."
                                className="w-full rounded-lg py-2 px-4 pr-10 text-sm border-1 border-gray-400 bg-gray-100"
                                required
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                            />
                        </div>

                        {/* Botão de envio */}
                        <Button type="submit" variant="primary">
                            Cadastrar {tipoUsuario === "aluno" ? "Aluno" : "Professor"}
                        </Button>

                        {/* Mensagem de erro */}
                        {erro && <p className="text-red-600 text-sm">{erro}</p>}
                    </form>
                )}

                {/* Contato em caso de problemas */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-600">
                        Caso tenha problemas no cadastro, nos envie um email.{" "}
                        <a
                            href="mailto:contato@plataforma.com"
                            className="text-blue-600 hover:underline break-words overflow-hidden leading-tight"
                        >
                            <br/>
                            contato@plataforma.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cadastrar;
