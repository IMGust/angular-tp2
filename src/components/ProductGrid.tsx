"use client";

import React from "react";
import { useCart } from "../context/CartContext";
import { ProductCard } from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

export const ProductGrid: React.FC = () => {
  const { getFilteredProducts } = useCart();
  const products = getFilteredProducts();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  return (
    <div className="flex-1">
      {/* Grid Header Info */}
      <div className="flex items-center justify-between mb-4 font-mono text-[10px] text-gray-400 tracking-wider">
        <span className="uppercase">ESPECIFICAÇÕES DOS COMPONENTES</span>
        <span className="font-bold text-brand-black">{products.length} {products.length === 1 ? 'ITEM ENCONTRADO' : 'ITENS ENCONTRADOS'}</span>
      </div>

      <AnimatePresence mode="popLayout">
        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full bg-white border border-gray-200 rounded-lg p-12 text-center flex flex-col items-center justify-center font-mono"
            id="empty-grid"
          >
            <Info className="h-6 w-6 text-gray-300 mb-3" />
            <h4 className="text-sm font-bold text-brand-black mb-1">NENHUM COMPONENTE ENCONTRADO</h4>
            <p className="text-[11px] text-gray-400 max-w-sm">
              Altere a categoria, limpe os parâmetros de busca ou amplie a faixa de preços para encontrar as peças desejadas.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="products-grid"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
