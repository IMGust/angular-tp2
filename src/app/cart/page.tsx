"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PRODUCTS } from "../../data/products";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  CheckCircle, 
  Truck, 
  AlertCircle,
  CreditCard,
  QrCode,
  FileText,
  User,
  MapPin,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal, 
    clearCart,
    addToCart
  } = useCart();

  // Checkout flow state: 'cart' | 'checkout' | 'success'
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [orderNumber, setOrderNumber] = useState("");

  // Checkout Form States
  const [cpf, setCpf] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | "boleto">("pix");

  // Credit Card States
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const subtotal = getCartTotal();
  
  // Calculate total package weight for technical shipping logistics fee
  const totalWeight = cart.reduce((acc, item) => {
    const weightStr = item.product.specs.weight;
    const weightNum = parseFloat(weightStr.replace(/[^\d.]/g, "")) || 0;
    return acc + (weightNum * item.quantity);
  }, 0);

  // Shipping calculated at $0.50 per kg (technical simulation)
  const shipping = totalWeight > 0 ? Math.max(15, totalWeight * 0.5) : 0;
  const total = subtotal + shipping;

  // Load user data on mount to pre-fill checkout fields
  useEffect(() => {
    const savedUserStr = localStorage.getItem("motor_api_user");
    if (savedUserStr) {
      try {
        const u = JSON.parse(savedUserStr);
        if (u.address) {
          setStreet(u.address.street || "");
          setNumber(u.address.number || "");
          setComplement(u.address.complement || "");
          setZipCode(u.address.zipCode || "");
          setCity(u.address.city || "");
          setStateName(u.address.state || "");
        }
      } catch (e) {}
    }
  }, []);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === "cart") {
      setCheckoutStep("checkout");
      return;
    }

    // Generate order number
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `ORD-${rand}`;
    
    // Save order to history in localStorage
    const today = new Date().toISOString().split("T")[0];
    const itemsStr = cart.map(item => `${item.quantity}x ${item.product.name}`).join(", ");
    
    const defaultOrders = [
      {
        id: "ORD-9082",
        date: "2026-05-24",
        items: "1x Turbocompressor G-35 Rolamentado, 1x Válvula Gate Eletrônica Wastegate",
        total: 2480.00,
        status: "Processando" as const,
      },
      {
        id: "ORD-8512",
        date: "2026-04-18",
        items: "1x Radiador Aeroflow X-Series, 1x Cabeçote de Fluxo Rápido 16V CNC",
        total: 2300.00,
        status: "Enviado" as const,
      },
      {
        id: "ORD-7190",
        date: "2026-02-10",
        items: "1x Monocoque Chassis Carbono-X, 1x Kit Suspensão Ajustável Track-Line",
        total: 15900.00,
        status: "Entregue" as const,
      }
    ];

    const savedOrdersStr = localStorage.getItem("motor_api_orders");
    let existingOrders = defaultOrders;
    if (savedOrdersStr) {
      try {
        existingOrders = JSON.parse(savedOrdersStr);
      } catch (e) {}
    }

    const newOrder = {
      id: newOrderId,
      date: today,
      items: itemsStr,
      total: total,
      status: "Processando" as const
    };

    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem("motor_api_orders", JSON.stringify(updatedOrders));

    // Save billing address and details for invoice simulations if needed
    const lastCheckoutDetails = {
      cpf,
      address: { street, number, complement, zipCode, city, state: stateName },
      paymentMethod,
      orderId: newOrderId
    };
    localStorage.setItem("motor_api_last_checkout", JSON.stringify(lastCheckoutDetails));

    setOrderNumber(newOrderId);
    setCheckoutStep("success");
    clearCart();
  };

  // Recommendations: products not in cart (limit to 3)
  const recommendations = PRODUCTS
    .filter((p) => !cart.some((item) => item.product.id === p.id))
    .slice(0, 3);

  // Simple Mini Technical Drawing icon based on category
  const renderMiniIcon = (category: string) => {
    const cls = "h-8 w-8 stroke-[1.2] text-brand-black";
    switch (category.toLowerCase()) {
      case "radiador":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={cls}>
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <line x1="7" y1="4" x2="7" y2="20" strokeDasharray="1 1" />
            <line x1="12" y1="4" x2="12" y2="20" />
            <line x1="17" y1="4" x2="17" y2="20" strokeDasharray="1 1" />
          </svg>
        );
      case "motor":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={cls}>
            <rect x="4" y="6" width="16" height="12" rx="1" />
            <circle cx="12" cy="12" r="3" />
            <line x1="4" y1="9" x2="20" y2="9" />
          </svg>
        );
      case "veículo":
      case "veiculo":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={cls}>
            <path d="M2 15h20M5 15a2 2 0 1 0 4 0M15 15a2 2 0 1 0 4 0" />
            <path d="M4 11l4-4h8l4 4" />
          </svg>
        );
      case "supercharger":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={cls}>
            <rect x="4" y="6" width="12" height="12" rx="2" />
            <circle cx="18" cy="12" r="3" />
          </svg>
        );
      case "turbo":
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={cls}>
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
          </svg>
        );
      default:
        return <ShoppingBag className="h-6 w-6 text-gray-400" />;
    }
  };

  // Mask CPF input helper
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    // Formatting: 000.000.000-00
    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }
    setCpf(value);
  };

  // Formatting Card Number helper
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    // Formatting: 0000 0000 0000 0000
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4));
    }
    setCardNumber(parts.join(" "));
  };

  // Expiry Date mask
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-mono text-brand-black selection:bg-brand-black selection:text-white">
      {/* Header escuro fixo */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Progress Tracker Bar */}
        <div className="mb-8 pb-4 border-b border-gray-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-gray-400 block tracking-widest uppercase">CONFERÊNCIA E EXPEDIÇÃO</span>
            <h1 className="text-xl font-bold tracking-tight text-brand-black uppercase">
              {checkoutStep === "cart" && "Carrinho de Compras"}
              {checkoutStep === "checkout" && "Protocolo de Fechamento"}
              {checkoutStep === "success" && "Solicitação Concluída"}
            </h1>
          </div>
          
          {/* Technical Progress Steps */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span className={checkoutStep === "cart" ? "text-brand-black" : "text-gray-400"}>[01] LISTA</span>
            <span>&gt;&gt;</span>
            <span className={checkoutStep === "checkout" ? "text-brand-black" : "text-gray-400"}>[02] CONFERÊNCIA</span>
            <span>&gt;&gt;</span>
            <span className={checkoutStep === "success" ? "text-brand-black" : "text-gray-400"}>[03] SUCESSO</span>
          </div>
        </div>

        {checkoutStep === "success" ? (
          /* SUCCESS STATE PANEL */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto bg-white border border-gray-200 rounded-lg p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
            id="checkout-success"
          >
            <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-sm font-bold text-brand-black tracking-wider uppercase mb-2">REQUISIÇÃO OPERACIONAL APROVADA</h2>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Seu pedido <span className="font-bold text-brand-black">{orderNumber}</span> foi registrado no sistema logístico de distribuição. As especificações dimensionais e notas fiscais foram enviadas para seu terminal de e-mail.
            </p>

            <div className="bg-brand-light border border-gray-200 rounded p-4 text-left space-y-2 text-[10px] text-gray-600 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">PEDIDO IDENTIFICADOR:</span>
                <span className="font-bold text-brand-black">{orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-gray-250/20 pb-1.5">
                <span className="text-gray-400">CPF DO REQUISITANTE:</span>
                <span className="font-mono text-brand-black">{cpf || "Não Informado"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-250/20 pb-1.5">
                <span className="text-gray-400">MÉTODO DE EXPEDIÇÃO:</span>
                <span>LOGÍSTICA TERRESTRE SEGURA (DIN)</span>
              </div>
              <div className="flex flex-col border-b border-gray-250/20 pb-1.5 gap-0.5">
                <span className="text-gray-400">ENDEREÇO DE DESCARGA:</span>
                <span className="text-brand-black uppercase">
                  {street}, Nº {number} {complement && `(${complement})`} - CEP: {zipCode} - {city}/{stateName}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-250/20 pb-1.5">
                <span className="text-gray-400">MÉTODO OPERACIONAL DE PAGAMENTO:</span>
                <span className="font-bold text-brand-black uppercase">
                  {paymentMethod === "pix" && "PIX IMEDIATO"}
                  {paymentMethod === "card" && "CARTÃO DE CRÉDITO SECURE"}
                  {paymentMethod === "boleto" && "BOLETO INDUSTRIAL 30 DDL"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">TRACKING HASH:</span>
                <span className="font-mono text-brand-black">hash_key_{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href="/"
                onClick={() => setCheckoutStep("cart")}
                className="py-2 px-5 bg-brand-black text-white hover:bg-brand-black/95 font-bold text-[10px] tracking-wider rounded uppercase transition-all"
              >
                Voltar ao Catálogo
              </Link>
              <Link
                href="/account"
                className="py-2 px-5 bg-white border border-gray-200 text-brand-black hover:border-gray-400 font-bold text-[10px] tracking-wider rounded uppercase transition-all"
              >
                Minha Conta / Histórico
              </Link>
            </div>
          </motion.div>
        ) : cart.length === 0 ? (
          /* EMPTY CART STATE */
          <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-10 text-center shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <ShoppingBag className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <h2 className="text-xs font-bold text-brand-black tracking-wider uppercase mb-1">NENHUM COMPONENTE AQUI</h2>
            <p className="text-[11px] text-gray-400 leading-normal mb-6">
              Seu carrinho está vazio no momento. Navegue pelo nosso catálogo técnico para adicionar componentes industriais à lista.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 py-2 px-6 bg-brand-black text-white hover:bg-brand-black/90 text-[10px] font-bold tracking-widest rounded uppercase transition-all"
            >
              <span>EXPLORAR CATÁLOGO</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          /* ACTIVE CART LAYOUT & CHECKOUT STEP */
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left side: Item list OR Checkout Form */}
            <div className="flex-1 min-w-0">
              
              {checkoutStep === "cart" ? (
                /* STEP 1: CART LIST */
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider">LISTA DE SOLICITAÇÃO</span>
                      <button
                        onClick={clearCart}
                        className="text-[9px] text-gray-400 hover:text-red-500 tracking-wider uppercase transition-colors"
                      >
                        Esvaziar Lista
                      </button>
                    </div>

                    <ul className="divide-y divide-gray-100">
                      <AnimatePresence>
                        {cart.map((item) => (
                          <motion.li
                            key={item.product.id}
                            layout
                            exit={{ opacity: 0, height: 0, padding: 0 }}
                            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            id={`cart-item-${item.product.id}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 bg-brand-light border border-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                {renderMiniIcon(item.product.category)}
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase block">
                                  {item.product.category}
                                </span>
                                <span className="text-xs font-bold text-brand-black block font-sans">
                                  {item.product.name}
                                </span>
                                <span className="text-[9px] text-gray-400 block mt-0.5">
                                  P/N: {item.product.partNumber}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6">
                              <div className="flex items-center border border-gray-200 rounded bg-brand-light">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="p-1.5 text-gray-500 hover:text-brand-black cursor-pointer"
                                  title="Diminuir quantidade"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 text-xs font-bold text-brand-black select-none">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="p-1.5 text-gray-500 hover:text-brand-black cursor-pointer"
                                  title="Aumentar quantidade"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <div className="text-right min-w-[90px] font-mono">
                                <span className="text-[9px] text-gray-400 block">TOTAL ITEM</span>
                                <span className="text-xs font-bold text-brand-black">
                                  $ {(item.product.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </span>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-all cursor-pointer"
                                title="Remover item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>

                  <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4 font-mono text-[9px] text-gray-500 leading-relaxed shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <AlertCircle className="h-4 w-4 text-brand-black flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-brand-black uppercase mb-0.5">NOTIFICAÇÃO DE ESPECIFICAÇÃO TÉCNICA</span>
                      As peças listadas acima são destinadas exclusivamente a aplicações de alta performance em conformidade com as diretivas industriais de segurança. Verifique a compatibilidade dos diâmetros nominais e conexões com as peças nativas antes do fechamento operacional.
                    </div>
                  </div>
                </div>
              ) : (
                /* STEP 2: CHECKOUT FORM SCREEN */
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  
                  {/* Personal Identification (CPF) */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <h3 className="text-xs font-bold text-brand-black tracking-wider uppercase pb-3.5 mb-4 border-b border-gray-100 flex items-center gap-2">
                      <User className="h-4 w-4 text-brand-black" />
                      <span>IDENTIFICAÇÃO FISCAL DO CLIENTE</span>
                    </h3>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 tracking-wider mb-2.5 uppercase">
                        Cadastro de Pessoa Física (CPF) *
                      </label>
                      <div className="relative max-w-xs">
                        <input
                          type="text"
                          required
                          placeholder="000.000.000-00"
                          value={cpf}
                          onChange={handleCpfChange}
                          className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-brand-black font-mono text-brand-black"
                        />
                      </div>
                      <span className="block text-[9px] text-gray-400 mt-1.5 uppercase">
                        CPF é obrigatório para fins de emissão de notas fiscais técnicas do material.
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address (Endereço) */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <h3 className="text-xs font-bold text-brand-black tracking-wider uppercase pb-3.5 mb-4 border-b border-gray-100 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand-black" />
                      <span>ENDEREÇO TÉCNICO DE DESCARGA</span>
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">RUA / AVENIDA *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Avenida Paulista"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">NÚMERO *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: 1000"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">COMPLEMENTO</label>
                          <input
                            type="text"
                            placeholder="Ex: Apto 12, Bloco B"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                            className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">CEP / CÓDIGO POSTAL *</label>
                          <input
                            type="text"
                            required
                            placeholder="00000-000"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">CIDADE *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: São Paulo"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">ESTADO *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: SP"
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method (Método de Pagamento) */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <h3 className="text-xs font-bold text-brand-black tracking-wider uppercase pb-3.5 mb-4 border-b border-gray-100 flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-brand-black" />
                      <span>PROCEDIMENTO OPERACIONAL DE PAGAMENTO</span>
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`p-3 rounded border text-xs font-bold tracking-wider uppercase flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === "pix"
                            ? "bg-brand-black border-brand-black text-white"
                            : "bg-brand-light border-gray-200 hover:border-brand-black text-gray-600 hover:text-brand-black"
                        }`}
                      >
                        <QrCode className="h-4 w-4" />
                        <span>PIX IMEDIATO</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 rounded border text-xs font-bold tracking-wider uppercase flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === "card"
                            ? "bg-brand-black border-brand-black text-white"
                            : "bg-brand-light border-gray-200 hover:border-brand-black text-gray-600 hover:text-brand-black"
                        }`}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>CARTÃO CRÉDITO</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("boleto")}
                        className={`p-3 rounded border text-xs font-bold tracking-wider uppercase flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                          paymentMethod === "boleto"
                            ? "bg-brand-black border-brand-black text-white"
                            : "bg-brand-light border-gray-200 hover:border-brand-black text-gray-600 hover:text-brand-black"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        <span>BOLETO 30 DDL</span>
                      </button>
                    </div>

                    {/* Dynamic payment instructions */}
                    {paymentMethod === "pix" && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded flex flex-col sm:flex-row items-center gap-6 font-mono">
                        {/* Simulated QR Code drawing */}
                        <div className="w-24 h-24 bg-white border border-gray-300 p-2 rounded flex-shrink-0 flex flex-wrap items-center justify-center relative">
                          <div className="w-18 h-18 border border-brand-black relative flex items-center justify-center">
                            <div className="w-14 h-14 border-4 border-brand-black border-double flex items-center justify-center bg-zinc-100">
                              <div className="w-6 h-6 bg-brand-black" />
                            </div>
                            <div className="absolute top-1 left-1 w-2.5 h-2.5 bg-brand-black" />
                            <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-black" />
                            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 bg-brand-black" />
                          </div>
                        </div>
                        <div className="space-y-1.5 flex-1">
                          <span className="text-[10px] font-bold text-brand-black block uppercase">CHAVE COPIA E COLA</span>
                          <input
                            type="text"
                            readOnly
                            value="pix.key.motorapi.secure.payment.transaction.0xAC79B"
                            className="w-full bg-white border border-gray-200 text-[9px] p-1.5 rounded focus:outline-none select-all text-gray-600"
                          />
                          <p className="text-[9px] text-gray-400 uppercase leading-normal">
                            Desconto de 2% aplicado. O processamento operacional e liberação da carga de peças na doca é instantâneo após a confirmação bancária.
                          </p>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "boleto" && (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded font-mono text-[9px] text-gray-500 space-y-1.5 uppercase leading-normal">
                        <span className="text-[10px] font-bold text-brand-black block">FATURAMENTO INDUSTRIAL COMPROMISSADO</span>
                        <p>
                          A liberação técnica da expedição ocorrerá após validação de crédito do CPF ou CNPJ requisitante. O boleto com vencimento para 30 dias corridos contados da emissão da nota técnica será enviado anexado ao e-mail.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        
                        {/* Blueprint stylized credit card preview */}
                        <div className="w-full max-w-sm mx-auto bg-brand-black text-white p-6 rounded-xl border border-white/10 font-mono shadow-md relative overflow-hidden flex flex-col justify-between h-40">
                          {/* Grid blueprint background */}
                          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                            <svg width="100%" height="100%">
                              <defs>
                                <pattern id="card-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#card-grid)" />
                            </svg>
                          </div>
                          
                          <div className="flex justify-between items-center relative z-10">
                            <span className="text-[9px] text-white/50 tracking-widest uppercase">MOTOR-API SECURE CARD</span>
                            <Lock className="h-3.5 w-3.5 text-white/40" />
                          </div>

                          <div className="text-md font-bold tracking-widest text-white/95 my-3 relative z-10">
                            {cardNumber || "•••• •••• •••• ••••"}
                          </div>

                          <div className="flex justify-between items-end relative z-10 text-[9px]">
                            <div>
                              <span className="text-[8px] text-white/45 block uppercase">TITULAR</span>
                              <span className="font-bold text-white uppercase">{cardName || "NOME DO TITULAR"}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] text-white/45 block uppercase">VALIDADE</span>
                              <span className="font-bold text-white">{cardExpiry || "MM/AA"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card input forms */}
                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                          <div className="col-span-2">
                            <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">NÚMERO DO CARTÃO *</label>
                            <input
                              type="text"
                              required={paymentMethod === "card"}
                              placeholder="0000 0000 0000 0000"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">NOME DO TITULAR (COMO NO CARTÃO) *</label>
                            <input
                              type="text"
                              required={paymentMethod === "card"}
                              placeholder="EX: GABRIEL SILVA"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black uppercase"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">VALIDADE (MM/AA) *</label>
                            <input
                              type="text"
                              required={paymentMethod === "card"}
                              placeholder="MM/AA"
                              value={cardExpiry}
                              onChange={handleCardExpiryChange}
                              className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-400 tracking-wider mb-1 uppercase">CVV / CÓD. SEGURANÇA *</label>
                            <input
                              type="text"
                              required={paymentMethod === "card"}
                              placeholder="123"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                              className="w-full bg-brand-light border border-gray-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-brand-black font-mono text-brand-black"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation actions */}
                  <div className="flex gap-4 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("cart")}
                      className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:text-brand-black hover:border-gray-400 bg-white rounded uppercase tracking-wider font-bold transition-all cursor-pointer text-center"
                    >
                      Voltar ao Carrinho
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-brand-black text-white hover:bg-brand-black/95 rounded uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>CONFIRMAR E FINALIZAR</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </form>
              )}
            </div>

            {/* Right side: Summary panel */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] font-mono">
                <h3 className="text-xs font-bold text-brand-black tracking-wider uppercase pb-3.5 mb-4 border-b border-gray-100 flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5" />
                  <span>RESUMO DA REQUISIÇÃO</span>
                </h3>

                {/* Micro Item List Summary */}
                <div className="mb-4 space-y-2 border-b border-gray-100 pb-4 max-h-40 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-[10px] text-gray-500 gap-2">
                      <span className="truncate uppercase font-bold">{item.quantity}x {item.product.name}</span>
                      <span className="font-bold flex-shrink-0 text-brand-black">
                        $ {(item.product.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3.5 text-xs text-gray-600 mb-5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SUBTOTAL PEÇAS:</span>
                    <span className="font-bold text-brand-black">$ {subtotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">PESO CARGA TAXADA:</span>
                    <span className="font-bold text-brand-black">{totalWeight.toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">EXPEDIÇÃO LOGÍSTICA:</span>
                    <span className="font-bold text-brand-black">
                      {shipping === 0 ? "GRÁTIS" : `$ ${shipping.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3.5 flex justify-between text-sm font-bold">
                    <span className="text-brand-black">TOTAL NOMINAL:</span>
                    <span className="text-brand-black text-sm">$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {checkoutStep === "cart" && (
                  <button
                    onClick={() => setCheckoutStep("checkout")}
                    className="w-full bg-brand-black text-white hover:bg-brand-black/95 py-2.5 rounded text-[10px] font-bold tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    id="checkout-btn"
                  >
                    <span>AVANÇAR PARA FECHAMENTO</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}

                <div className="mt-4 text-center">
                  <Link
                    href="/"
                    className="text-[9px] text-gray-400 hover:text-brand-black transition-colors uppercase tracking-wider"
                  >
                    Adicionar Mais Peças
                  </Link>
                </div>
              </div>
            </aside>

          </div>
        )}

        {/* Dynamic discreet suggestions (only show if not in success state) */}
        {checkoutStep === "cart" && recommendations.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xs font-bold text-brand-black tracking-wider uppercase mb-6 flex items-center gap-1.5 font-mono">
              <span className="h-1.5 w-1.5 bg-brand-black rounded-full" />
              SUGESTÕES DE COMPLEMENTAÇÃO TÉCNICA
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-brand-black transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                  id={`suggestion-${product.id}`}
                >
                  <div className="overflow-hidden pr-2 font-mono">
                    <span className="text-[8px] font-bold text-gray-400 tracking-wider uppercase block">
                      {product.category}
                    </span>
                    <h4 className="text-[11px] font-bold text-brand-black truncate block mt-0.5">
                      {product.name}
                    </h4>
                    <span className="text-[10px] font-bold text-brand-black block mt-1">
                      $ {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-shrink-0 py-1.5 px-3 bg-brand-light hover:bg-brand-black text-brand-black hover:text-white border border-gray-200 hover:border-brand-black text-[9px] font-bold font-mono tracking-wider rounded transition-all cursor-pointer"
                    id={`add-sug-btn-${product.id}`}
                  >
                    INCLUIR
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer discreto */}
      <Footer />
    </div>
  );
}
