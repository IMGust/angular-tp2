"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useCart } from "../../context/CartContext";
import { PRODUCTS } from "../../data/products";
import { 
  User, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Clock, 
  ShieldCheck, 
  Heart
} from "lucide-react";

interface Order {
  id: string;
  date: string;
  items: string;
  total: number;
  status: "Processando" | "Enviado" | "Entregue";
}

export default function Account() {
  const router = useRouter();
  const { favorites, toggleFavorite, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "wishlist" | "settings">("dashboard");

  const [user, setUser] = useState({
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
  });
  const [orders, setOrders] = useState<Order[]>([]);

  // Profile fields state
  const [editName, setEditName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [editComplement, setEditComplement] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editStateName, setEditStateName] = useState("");
  const [editZipCode, setEditZipCode] = useState("");

  const [profileMessage, setProfileMessage] = useState("");

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("motor_api_logged_in");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const savedUserStr = localStorage.getItem("motor_api_user");
    let currentUser = user;
    if (savedUserStr) {
      try {
        currentUser = JSON.parse(savedUserStr);
        setUser(currentUser);
      } catch (e) {}
    } else {
      localStorage.setItem("motor_api_user", JSON.stringify(user));
    }

    // Populate edit fields
    setEditName(currentUser.name || "");
    setEditLastName(currentUser.lastName || "");
    setEditEmail(currentUser.email || "");
    setEditStreet(currentUser.address?.street || "");
    setEditNumber(currentUser.address?.number || "");
    setEditComplement(currentUser.address?.complement || "");
    setEditCity(currentUser.address?.city || "");
    setEditStateName(currentUser.address?.state || "");
    setEditZipCode(currentUser.address?.zipCode || "");

    const savedOrdersStr = localStorage.getItem("motor_api_orders");
    if (savedOrdersStr) {
      try {
        setOrders(JSON.parse(savedOrdersStr));
      } catch (e) {}
    } else {
      const defaultOrders: Order[] = [
        {
          id: "ORD-9082",
          date: "2026-05-24",
          items: "1x Turbocompressor G-35 Rolamentado, 1x Válvula Gate Eletrônica Wastegate",
          total: 2480.00,
          status: "Processando",
        },
        {
          id: "ORD-8512",
          date: "2026-04-18",
          items: "1x Radiador Aeroflow X-Series, 1x Cabeçote de Fluxo Rápido 16V CNC",
          total: 2300.00,
          status: "Enviado",
        },
        {
          id: "ORD-7190",
          date: "2026-02-10",
          items: "1x Monocoque Chassis Carbono-X, 1x Kit Suspensão Ajustável Track-Line",
          total: 15900.00,
          status: "Entregue",
        }
      ];
      localStorage.setItem("motor_api_orders", JSON.stringify(defaultOrders));
      setOrders(defaultOrders);
    }
  }, []);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage("");

    const updatedUser = {
      ...user,
      name: editName,
      lastName: editLastName,
      email: editEmail,
      address: {
        street: editStreet,
        number: editNumber,
        complement: editComplement,
        city: editCity,
        state: editStateName,
        zipCode: editZipCode
      }
    };

    localStorage.setItem("motor_api_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setProfileMessage("Cadastro atualizado com sucesso!");
    setTimeout(() => setProfileMessage(""), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (currentPassword !== user.password) {
      setPasswordError("Senha atual incorreta.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("A confirmação da nova senha não confere.");
      return;
    }

    const updatedUser = {
      ...user,
      password: newPassword
    };

    localStorage.setItem("motor_api_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setPasswordSuccess("Senha alterada com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("motor_api_logged_in");
    router.push("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "MINHA CONTA", icon: User },
    { id: "orders", label: "HISTÓRICO DE COMPRAS", icon: ShoppingBag },
    { id: "wishlist", label: "LISTA DE DESEJOS", icon: Heart },
    { id: "settings", label: "CONFIGURAÇÕES DA CONTA", icon: Settings },
  ];

  // Calculations for dashboard
  const totalInvested = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrdersCount = orders.filter(order => order.status !== "Entregue").length;
  const favoritesCount = favorites.length;
  const favoriteProducts = PRODUCTS.filter(product => favorites.includes(product.id));

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-mono text-brand-black">
      {/* Fixed dark header */}
      <Header />

      {/* Main Administrative Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Title */}
        <div className="mb-8 pb-4 border-b border-gray-200/60">
          <span className="text-[10px] text-gray-400 block tracking-widest uppercase">ÁREA DO CLIENTE</span>
          <h1 className="text-xl font-bold tracking-tight text-brand-black uppercase">SESSÃO DE USUÁRIO</h1>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Menu */}
          <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] h-fit">
            {/* User identification */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
              <div className="h-9 w-9 rounded-full bg-brand-black flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-bold text-brand-black block truncate">{user.name.toUpperCase()} {user.lastName.toUpperCase()}</span>
                <span className="text-[9px] text-gray-400 block truncate">{user.email}</span>
              </div>
            </div>

            {/* Menu Buttons */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full text-left text-xs py-2 px-3 rounded transition-all flex items-center gap-2.5 cursor-pointer ${
                      isActive
                        ? "bg-brand-black text-white"
                        : "hover:bg-brand-light text-gray-600 hover:text-brand-black"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="w-full text-left text-xs py-2 px-3 rounded hover:bg-red-50 text-red-500 transition-all flex items-center gap-2.5 cursor-pointer mt-4 border-t border-gray-100 pt-4"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>ENCERRAR SESSÃO</span>
              </button>
            </div>
          </aside>

          {/* Central Admin Content */}
          <section className="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            
            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs font-bold text-brand-black tracking-wider uppercase mb-1">
                    INFORMAÇÕES DE CADASTRO
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Resumo das métricas operacionais e especificações técnicas de faturamento de sua conta.
                  </p>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-brand-light border border-gray-200 rounded p-4">
                    <span className="text-[9px] text-gray-400 block uppercase">TOTAL COMPRADO</span>
                    <span className="text-sm font-bold text-brand-black">$ {totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-brand-light border border-gray-200 rounded p-4">
                    <span className="text-[9px] text-gray-400 block uppercase">PEDIDOS ATIVOS</span>
                    <span className="text-sm font-bold text-brand-black">{activeOrdersCount} EM CURSO</span>
                  </div>
                  <div className="bg-brand-light border border-gray-200 rounded p-4">
                    <span className="text-[9px] text-gray-400 block uppercase">DESEJADOS</span>
                    <span className="text-sm font-bold text-brand-black">{favoritesCount} ITENS</span>
                  </div>
                  <div className="bg-brand-light border border-gray-200 rounded p-4">
                    <span className="text-[9px] text-gray-400 block uppercase">TIPO DE CONTA</span>
                    <span className="text-sm font-bold text-brand-black">
                      {user.email === "admin@motorapi.com" ? "ADMINISTRADOR" : "CLIENTE MOTOR-API"}
                    </span>
                  </div>
                </div>

                {user.email === "admin@motorapi.com" && (
                  <div className="bg-zinc-950 border border-zinc-800 text-white rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
                    <div>
                      <span className="text-[9px] text-emerald-400 block tracking-widest uppercase font-bold">TERMINAL CENTRAL ENCONTRADO</span>
                      <h4 className="text-xs font-bold text-white uppercase mt-0.5">Sua conta possui acesso administrativo geral.</h4>
                      <p className="text-[9px] text-zinc-400 leading-normal uppercase mt-1">
                        Utilize o link abaixo para gerenciar componentes, visualizar payloads REST coerentes com Quarkus e gerenciar o catálogo ativo.
                      </p>
                    </div>
                    <Link
                      href="/admin"
                      className="w-full sm:w-auto text-center px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] tracking-wider rounded uppercase transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Acessar Console Admin
                    </Link>
                  </div>
                )}

                {/* User Address Quick View Panel */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-brand-black" />
                    <span className="text-xs font-bold text-brand-black tracking-wider uppercase">ENDEREÇO DE EXPEDIÇÃO PRINCIPAL</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-3 leading-normal uppercase">
                    {user.address && user.address.street ? (
                      <>
                        {user.address.street}, Nº {user.address.number} {user.address.complement && `(${user.address.complement})`}
                        <br />
                        CEP: {user.address.zipCode} | {user.address.city} - {user.address.state}
                      </>
                    ) : (
                      "Endereço não cadastrado."
                    )}
                  </p>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="text-[9px] font-bold text-brand-black hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    Editar Endereço
                  </button>
                </div>

                {/* Micro Order Summary (Recent) */}
                <div>
                  <h3 className="text-xs font-bold text-brand-black tracking-wider uppercase mb-3">
                    MOVIMENTAÇÕES RECENTES
                  </h3>
                  <div className="overflow-x-auto">
                    {orders.length === 0 ? (
                      <p className="text-xs text-gray-400 uppercase">Nenhum pedido recente registrado.</p>
                    ) : (
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-400 font-bold">
                            <th className="py-2.5">CÓDIGO</th>
                            <th className="py-2.5">DATA</th>
                            <th className="py-2.5">ITENS ADQUIRIDOS</th>
                            <th className="py-2.5 text-right">TOTAL NOMINAL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.slice(0, 2).map((order) => (
                            <tr key={order.id} className="text-gray-600">
                              <td className="py-3 font-bold text-brand-black">{order.id}</td>
                              <td className="py-3">{order.date}</td>
                              <td className="py-3 max-w-[200px] truncate">{order.items}</td>
                              <td className="py-3 text-right font-bold text-brand-black">
                                $ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs font-bold text-brand-black tracking-wider uppercase mb-1">
                    HISTÓRICO COMPLETO DE COMPRAS
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Consulte o status logístico e as notas fiscais dos componentes automotivos adquiridos.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 uppercase font-bold tracking-wider">
                      Você ainda não realizou nenhuma compra.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-400 font-bold text-[10px] tracking-wider uppercase">
                          <th className="py-3">CÓDIGO</th>
                          <th className="py-3">DATA</th>
                          <th className="py-3">ITENS COMPONENTES</th>
                          <th className="py-3">STATUS</th>
                          <th className="py-3 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="text-gray-600 hover:bg-brand-light/40 transition-colors">
                            <td className="py-4 font-bold text-brand-black">{order.id}</td>
                            <td className="py-4 whitespace-nowrap">{order.date}</td>
                            <td className="py-4 max-w-[260px] truncate pr-4">{order.items}</td>
                            <td className="py-4">
                              <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                order.status === "Processando"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : order.status === "Enviado"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}>
                                <Clock className="h-2.5 w-2.5" />
                                {order.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 text-right font-bold text-brand-black">
                              $ {order.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs font-bold text-brand-black tracking-wider uppercase mb-1">
                    SUA LISTA DE DESEJOS
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Componentes mecânicos de alta performance favoritados no catálogo.
                  </p>
                </div>

                {favoriteProducts.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-gray-200 rounded-lg">
                    <Heart className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-4">Sua lista de desejos está vazia</p>
                    <Link
                      href="/"
                      className="inline-block py-2 px-5 bg-brand-black text-white hover:bg-brand-black/90 font-bold text-[10px] tracking-wider rounded uppercase transition-all"
                    >
                      Explorar Catálogo
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteProducts.map((product) => (
                      <div
                        key={product.id}
                        className="bg-brand-light/50 border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:border-brand-black transition-all"
                      >
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-white border border-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            <Heart className="h-5 w-5 text-red-500 fill-red-500 animate-pulse" />
                          </div>
                          <div className="overflow-hidden font-mono">
                            <span className="text-[8px] font-bold text-gray-400 tracking-wider block uppercase">{product.category}</span>
                            <span className="text-xs font-bold text-brand-black block truncate">{product.name}</span>
                            <span className="text-[9px] text-gray-400 block">P/N: {product.partNumber}</span>
                            <span className="text-xs font-bold text-brand-black block mt-2">
                              $ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-2 border-t border-gray-100 font-mono">
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="flex-1 py-1.5 border border-gray-200 hover:border-red-300 hover:text-red-500 text-[10px] font-bold rounded uppercase transition-all cursor-pointer text-gray-500 bg-white"
                          >
                            Remover
                          </button>
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 py-1.5 bg-brand-black text-white hover:bg-brand-black/95 text-[10px] font-bold rounded uppercase transition-all cursor-pointer"
                          >
                            Adicionar ao Carrinho
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs font-bold text-brand-black tracking-wider uppercase mb-1">
                    CONFIGURAÇÕES E DADOS DA CONTA
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Gerencie suas preferências de cadastro, endereços de expedição e chaves de acesso à plataforma.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Form */}
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <h3 className="text-[10px] font-bold text-brand-black tracking-widest uppercase border-b border-gray-100 pb-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-brand-black rounded-full" />
                      DADOS CADASTRAIS & ENDEREÇO
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">NOME</label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">SOBRENOME</label>
                        <input
                          type="text"
                          required
                          value={editLastName}
                          onChange={(e) => setEditLastName(e.target.value)}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">E-MAIL</label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">RUA / AV.</label>
                        <input
                          type="text"
                          required
                          value={editStreet}
                          onChange={(e) => setEditStreet(e.target.value)}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">NÚMERO</label>
                        <input
                          type="text"
                          required
                          value={editNumber}
                          onChange={(e) => setEditNumber(e.target.value)}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">COMPLEMENTO</label>
                        <input
                          type="text"
                          value={editComplement}
                          onChange={(e) => setEditComplement(e.target.value)}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">CEP</label>
                        <input
                          type="text"
                          required
                          value={editZipCode}
                          onChange={(e) => setEditZipCode(e.target.value)}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">CIDADE</label>
                        <input
                          type="text"
                          required
                          value={editCity}
                          onChange={(e) => setEditCity(e.target.value)}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">ESTADO</label>
                        <input
                          type="text"
                          required
                          value={editStateName}
                          onChange={(e) => setEditStateName(e.target.value)}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                    </div>

                    {profileMessage && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700 font-bold uppercase rounded">
                        {profileMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-black text-white hover:bg-brand-black/90 transition-all font-mono font-bold text-[10px] rounded cursor-pointer uppercase tracking-wider"
                    >
                      SALVAR ALTERAÇÕES CADASTRAIS
                    </button>
                  </form>

                  {/* Password Form */}
                  <form onSubmit={handleUpdatePassword} className="space-y-4 h-fit">
                    <h3 className="text-[10px] font-bold text-brand-black tracking-widest uppercase border-b border-gray-100 pb-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-brand-black rounded-full" />
                      ALTERAR CHAVE DE ACESSO / SENHA
                    </h3>

                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">SENHA ATUAL</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">NOVA SENHA</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">CONFIRMAR NOVA SENHA</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                      />
                    </div>

                    {passwordError && (
                      <div className="p-2.5 bg-red-50 border border-red-200 text-[10px] text-red-600 font-bold uppercase rounded">
                        {passwordError}
                      </div>
                    )}

                    {passwordSuccess && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700 font-bold uppercase rounded">
                        {passwordSuccess}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-brand-black text-white hover:bg-brand-black/90 transition-all font-mono font-bold text-[10px] rounded cursor-pointer uppercase tracking-wider"
                    >
                      ATUALIZAR SENHA
                    </button>
                  </form>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Discreet footer */}
      <Footer />
    </div>
  );
}
