"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { RadiatorIcon, EngineIcon, VehicleIcon, SuperchargerIcon, TurboIcon } from "./CustomIcons";
import { Search, ShoppingBag, Heart, User, RefreshCw } from "lucide-react";

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getCartCount,
    favorites,
    clearFilters
  } = useCart();

  const pathname = usePathname();
  const router = useRouter();
  const cartCount = getCartCount();

  const categories = [
    { name: "Todos", label: "Todos", icon: null },
    { name: "Radiador", label: "Radiador", icon: RadiatorIcon },
    { name: "Motor", label: "Motor", icon: EngineIcon },
    { name: "Veículo", label: "Veículo", icon: VehicleIcon },
    { name: "Supercharger", label: "Supercharger", icon: SuperchargerIcon },
    { name: "Turbo", label: "Turbo", icon: TurboIcon },
  ];

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    // If not on homepage, redirect to home
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-black text-white border-b border-white/5 shadow-sm">
      {/* Top Bar: Logo, Search, Navigation Items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              onClick={clearFilters}
              className="font-mono text-lg font-bold tracking-[0.2em] hover:text-white/80 transition-colors uppercase"
              id="nav-logo"
            >
              Motor-Api
            </Link>
          </div>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-md mx-auto hidden md:block">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/40" />
              </span>
              <input
                type="text"
                placeholder="Pesquisar especificações ou peças..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all font-mono"
                id="search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white"
                  title="Limpar pesquisa"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Minimalist Right Navigation Buttons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Account */}
            <Link
              href="/account"
              className={`p-2 rounded-md hover:bg-white/5 hover:text-white transition-all ${
                pathname === "/account" ? "text-white bg-white/5" : "text-white/60"
              }`}
              title="Conta"
              id="nav-account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Favorites */}
            <Link
              href="/"
              onClick={() => {
                setSelectedCategory("Todos");
                setSearchQuery("");
                // We'll simulate a filter of favorites on the homepage by letting user know
                // or setting search query to something, or simple filter.
                // For simplicity, we can show user's favorite count here.
              }}
              className="p-2 rounded-md hover:bg-white/5 hover:text-white transition-all text-white/60 relative"
              title="Favoritos"
              id="nav-favorites"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className={`p-2 rounded-md hover:bg-white/5 hover:text-white transition-all relative ${
                pathname === "/cart" ? "text-white bg-white/5" : "text-white/60"
              }`}
              title="Carrinho"
              id="nav-cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-brand-black text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (only visible on mobile layout) */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-white/40" />
          </span>
          <input
            type="text"
            placeholder="Pesquisar especificações..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-all font-mono"
            id="search-input-mobile"
          />
        </div>
      </div>

      {/* Category Navbar: Monochromatic, aligned horizontally, minimal */}
      <div className="w-full bg-brand-black/95 border-t border-white/5 overflow-x-auto scrollbar-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-center py-2.5 space-x-6 sm:space-x-10 min-w-max mx-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`flex items-center gap-2 py-1 px-3 rounded text-xs font-mono tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "text-white border-b border-white"
                      : "text-white/55 hover:text-white/90"
                  }`}
                  id={`cat-btn-${cat.name.toLowerCase()}`}
                >
                  {Icon && <Icon size={14} className="stroke-[1.5]" />}
                  <span>{cat.label.toUpperCase()}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
