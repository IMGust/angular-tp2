"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Terminal, Shield, Cpu } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Cadastro state
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zipCode, setZipCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API connection
    setTimeout(() => {
      if (isSignUp) {
        // Save new user to localStorage
        const newUser = {
          name,
          lastName,
          email,
          password,
          address: {
            street,
            number,
            complement,
            city,
            state: stateName,
            zipCode
          }
        };
        localStorage.setItem("motor_api_user", JSON.stringify(newUser));
        localStorage.setItem("motor_api_logged_in", "true");
        setIsLoading(false);
        router.push("/account");
      } else {
        // Check if Admin
        if (email.toLowerCase() === "admin@motorapi.com" && password === "admin") {
          localStorage.setItem("motor_api_logged_in", "true");
          localStorage.setItem("motor_api_is_admin", "true");
          
          const adminUser = {
            name: "Administrador",
            lastName: "Geral",
            email: "admin@motorapi.com",
            password: "admin",
            isAdmin: true,
            address: {
              street: "Central de Servidores",
              number: "999",
              complement: "Rack A1",
              city: "Curitiba",
              state: "PR",
              zipCode: "80000-000"
            }
          };
          localStorage.setItem("motor_api_user", JSON.stringify(adminUser));
          
          setIsLoading(false);
          router.push("/admin");
          return;
        }

        // Check credentials
        const savedUserStr = localStorage.getItem("motor_api_user");
        let validUser = {
          email: "gabriel.silva@motorapi.com",
          password: "admin"
        };
        if (savedUserStr) {
          try {
            validUser = JSON.parse(savedUserStr);
          } catch (err) {}
        }
        
        if (email.toLowerCase() === validUser.email.toLowerCase() && password === validUser.password) {
          // If no custom user was saved, initialize default
          if (!savedUserStr) {
            const defaultUser = {
              name: "Gabriel",
              lastName: "Silva",
              email: "gabriel.silva@motorapi.com",
              password: "admin",
              address: {
                street: "Avenida Paulista",
                number: "1000",
                complement: "Apto 12",
                city: "São Paulo",
                state: "SP",
                zipCode: "01310-100"
              }
            };
            localStorage.setItem("motor_api_user", JSON.stringify(defaultUser));
          }
          localStorage.setItem("motor_api_logged_in", "true");
          localStorage.setItem("motor_api_is_admin", "false");
          setIsLoading(false);
          router.push("/account");
        } else {
          setIsLoading(false);
          setError("Credenciais inválidas. Use o e-mail cadastrado ou 'gabriel.silva@motorapi.com' com senha 'admin'.");
        }
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-brand-light font-mono text-brand-black">
      {/* Left Pane: Minimalist Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-6 sm:p-12 bg-white relative">
        {/* Back Link */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-brand-black transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Voltar ao catálogo</span>
          </Link>
          <span className="text-[9px] text-gray-400">CONN // SECURE</span>
        </div>

        {/* Centered Login Card Container */}
        <div className={`w-full mx-auto my-auto py-8 transition-all duration-300 ${isSignUp ? "max-w-md" : "max-w-sm"}`}>
          {/* Logo / Header */}
          <div className="mb-6">
            <span className="text-[10px] text-gray-400 block tracking-widest uppercase mb-1">AUTENTICAÇÃO DO USUÁRIO</span>
            <h1 className="text-xl font-bold tracking-widest uppercase text-brand-black">MOTOR-API SYSTEM</h1>
          </div>

          {/* Tabs for Login / Signup */}
          <div className="flex border-b border-gray-200 mb-6 font-mono text-xs">
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(""); }}
              className={`flex-1 pb-2 font-bold tracking-wider text-center cursor-pointer ${!isSignUp ? "border-b-2 border-brand-black text-brand-black" : "text-gray-400 hover:text-brand-black"}`}
            >
              CONECTAR
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(""); }}
              className={`flex-1 pb-2 font-bold tracking-wider text-center cursor-pointer ${isSignUp ? "border-b-2 border-brand-black text-brand-black" : "text-gray-400 hover:text-brand-black"}`}
            >
              CRIAR CADASTRO
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-[10px] text-red-600 font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Nome</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Gabriel"
                      className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Sobrenome</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Silva"
                      className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Endereço de E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gabriel.silva@motorapi.com"
                    className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Senha / Chave de Acesso</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Rua / Av.</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Avenida Paulista"
                      className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Número</label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="1000"
                      className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Complemento</label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto 12"
                      className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">CEP</label>
                    <input
                      type="text"
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="01310-100"
                      className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Cidade</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1 uppercase">Estado</label>
                    <input
                      type="text"
                      required
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      placeholder="SP"
                      className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label 
                    htmlFor="email"
                    className="block text-[10px] font-bold text-gray-400 tracking-wider mb-1.5 uppercase"
                  >
                    Endereço de E-mail / Id
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gabriel.silva@motorapi.com"
                    className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2.5 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="password"
                      className="text-[10px] font-bold text-gray-400 tracking-wider uppercase"
                    >
                      Chave de Acesso / Senha
                    </label>
                    <Link
                      href="/login"
                      className="text-[9px] text-gray-400 hover:text-brand-black transition-colors"
                    >
                      Recuperar Chave
                    </Link>
                  </div>
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2.5 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black transition-all font-mono"
                  />
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-3.5 w-3.5 accent-brand-black border-gray-300 rounded cursor-pointer"
                  />
                  <label 
                    htmlFor="remember"
                    className="ml-2 text-[10px] text-gray-500 tracking-wide uppercase select-none cursor-pointer"
                  >
                    Manter terminal conectado
                  </label>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-black text-white hover:bg-brand-black/95 py-2.5 rounded text-[11px] font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isSignUp ? "CADASTRANDO..." : "CONECTANDO..."}</span>
                </>
              ) : (
                <span>{isSignUp ? "EFETUAR CADASTRO" : "CONECTAR AO SISTEMA"}</span>
              )}
            </button>
          </form>

          {/* Additional text */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-[9px] text-gray-400 leading-relaxed uppercase tracking-wider">
            {isSignUp 
              ? "Ao registrar-se você aceita as diretrizes de termos de uso de componentes e responsabilidade sobre projetos industriais." 
              : "Acesso restrito a engenheiros e parceiros cadastrados. Para solicitar credenciais de acesso à API e ao catálogo técnico de frotas, entre em contato com o suporte."
            }
          </div>

          {!isSignUp && (
            <div className="mt-4 p-3 bg-zinc-900 border border-zinc-800 rounded font-mono text-[9px] text-zinc-400 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Estação Admin / Engenharia</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-zinc-400 leading-normal uppercase">
                Clique abaixo para carregar credenciais de controle do painel de administração e cadastro de componentes Quarkus.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@motorapi.com");
                  setPassword("admin");
                }}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-1.5 px-2 rounded border border-zinc-700 hover:border-zinc-600 transition-colors uppercase tracking-widest text-[9px] cursor-pointer"
              >
                Ativar Painel de Controle
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-[9px] text-gray-400 border-t border-gray-100 pt-4">
          <span>MOTOR-API v2.4.0</span>
          <span>© 2026 MOTOR-API</span>
        </div>
      </div>

      {/* Right Pane: Dark Institutional Banner (Blueprints & Stats) */}
      <div className="hidden md:flex md:w-1/2 bg-brand-black text-white flex-col justify-between p-12 relative overflow-hidden">
        
        {/* CAD Blueprint grids decorative background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="login-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#login-grid)" />
            {/* Concentric circles or technical diagrams in the background */}
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="50%" cy="50%" r="120" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="40" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </svg>
        </div>

        {/* Content Top */}
        <div className="relative z-10 flex justify-between items-center text-[10px] text-white/50">
          <span className="tracking-[0.2em] font-bold text-white uppercase">MOTOR-API</span>
          <span>ESTAÇÃO DE TRABALHO // ID: 08F-9K</span>
        </div>

        {/* Content Middle: Corporate Statement & Graphics */}
        <div className="relative z-10 max-w-md my-auto">
          <div className="flex gap-3 mb-6">
            <div className="p-2 bg-white/5 rounded border border-white/10 text-white/80">
              <Cpu className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div className="p-2 bg-white/5 rounded border border-white/10 text-white/80">
              <Terminal className="h-5 w-5 stroke-[1.5]" />
            </div>
            <div className="p-2 bg-white/5 rounded border border-white/10 text-white/80">
              <Shield className="h-5 w-5 stroke-[1.5]" />
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-wider text-white uppercase leading-tight mb-4">
            ENGENHARIA INTEGRADA & DISTRIBUIÇÃO SILENCIOSA.
          </h2>
          <p className="text-xs text-white/60 leading-relaxed mb-6 font-mono font-light">
            Nossa plataforma centraliza o acesso a componentes mecânicos de alta performance para frotas comerciais, carros de competição e projetos sob medida. Obtenha dados de tolerância dimensional, testes em bancada de fluxo e arquivos CAD diretamente no seu terminal de engenharia.
          </p>

          {/* Small technical metrics */}
          <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
            <div>
              <span className="text-[9px] text-white/30 block tracking-widest uppercase">DISPONIBILIDADE</span>
              <span className="text-xs font-bold text-white tracking-wider">99.998% UPTIME</span>
            </div>
            <div>
              <span className="text-[9px] text-white/30 block tracking-widest uppercase">CRIPTOGRAFIA</span>
              <span className="text-xs font-bold text-white tracking-wider">AES-256 GCM SECURE</span>
            </div>
          </div>
        </div>

        {/* Content Bottom */}
        <div className="relative z-10 flex justify-between text-[9px] text-white/30 border-t border-white/10 pt-4">
          <span>SERVER LATENCY: ~0.02ms</span>
          <span>DB SYNC: OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
}
