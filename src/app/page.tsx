"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { SidebarFilters } from "../components/SidebarFilters";
import { ProductGrid } from "../components/ProductGrid";
import { Footer } from "../components/Footer";
import { SlidersHorizontal, Eye } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { selectedCategory, getFilteredProducts } = useCart();
  const products = getFilteredProducts();

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      {/* Header escuro fixo */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Title & Breadcrumb (Minimalist & Technical) */}
        <div className="mb-6 pb-4 border-b border-gray-200/60 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="font-mono">
            <span className="text-[10px] text-gray-400 block tracking-widest uppercase">CATÁLOGO TÉCNICO</span>
            <h1 className="text-xl font-bold tracking-tight text-brand-black uppercase">
              {selectedCategory === "Todos" ? "TODOS OS COMPONENTES" : `CATEGORIA: ${selectedCategory}`}
            </h1>
          </div>
          <div className="font-mono text-[9px] text-gray-400">
            <span>MOTOR-API // COMPONENTES // {selectedCategory.toUpperCase()}</span>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between bg-white border border-gray-200 rounded-md p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
            <span className="font-mono text-xs font-bold text-brand-black tracking-wider">PARÂMETROS DE BUSCA</span>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 py-1.5 px-3 bg-brand-black text-white text-[11px] font-mono font-bold tracking-wider rounded transition-all cursor-pointer"
              id="mobile-filters-toggle"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>{showMobileFilters ? "OCULTAR" : "FILTRAR"}</span>
            </button>
          </div>

          {/* Sidebar Left: Filters */}
          <div className={`${showMobileFilters ? "block" : "hidden"} lg:block lg:flex-shrink-0`}>
            <SidebarFilters />
          </div>

          {/* Grid Central of Products */}
          <div className="flex-1">
            {/* Quick Stats / Catalog Banner (Minimalist outline, NOT flashy) */}
            <div className="mb-6 bg-white border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.01)] font-mono">
              <div className="max-w-md">
                <h2 className="text-xs font-bold text-brand-black tracking-wider uppercase mb-1 flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-brand-black rounded-full" />
                  SISTEMA DE CONSULTA TÉCNICA
                </h2>
                <p className="text-[10px] text-gray-400 leading-normal">
                  Consulte especificações de engenharia, materiais base, pesos nominais, faixas de pressão e compatibilidade mecânica dos componentes automotivos listados no catálogo.
                </p>
              </div>
              <div className="text-[9px] text-gray-400 border-l border-gray-100 pl-4 flex-shrink-0">
                <span className="block text-brand-black font-bold">CONTROLE DE QUALIDADE</span>
                <span className="block mt-0.5">PADRÃO DIN / ISO 9001</span>
                <span className="block">DADOS ATUALIZADOS DIARIAMENTE</span>
              </div>
            </div>

            {/* Grid display */}
            <ProductGrid />
          </div>
        </div>
      </main>

      {/* Footer discreto */}
      <Footer />
    </div>
  );
}
