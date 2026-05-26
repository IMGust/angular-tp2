"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, PRODUCTS } from "../data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  favorites: string[];
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: string;
  materialFilter: string;
  products: Product[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sort: string) => void;
  setMaterialFilter: (material: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFilters: () => void;
  getFilteredProducts: () => Product[];
  getCartTotal: () => number;
  getCartCount: () => number;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (product: Product) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 15000]);
  const [sortBy, setSortBy] = useState("default");
  const [materialFilter, setMaterialFilter] = useState("Todos");
  const [products, setProducts] = useState<Product[]>([]);

  // Load cart, favorites and products from localStorage on client-side mount
  useEffect(() => {
    const savedCart = localStorage.getItem("motor_api_cart");
    const savedFavorites = localStorage.getItem("motor_api_favorites");
    const savedProducts = localStorage.getItem("motor_api_products");
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error reading cart from localStorage", e);
      }
    }
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Error reading favorites from localStorage", e);
      }
    }
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Error reading products from localStorage", e);
        setProducts(PRODUCTS);
      }
    } else {
      setProducts(PRODUCTS);
      localStorage.setItem("motor_api_products", JSON.stringify(PRODUCTS));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("motor_api_cart", JSON.stringify(cart));
  }, [cart]);

  // Save favorites to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("motor_api_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Save products to localStorage when they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("motor_api_products", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts((prev) => {
      const updated = [...prev, product];
      localStorage.setItem("motor_api_products", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("motor_api_products", JSON.stringify(updated));
      return updated;
    });
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === product.id ? product : p));
      localStorage.setItem("motor_api_products", JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter((id) => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("Todos");
    setPriceRange([0, 15000]);
    setSortBy("default");
    setMaterialFilter("Todos");
  };

  const getFilteredProducts = () => {
    let list = [...products];

    // Filter by Category
    if (selectedCategory !== "Todos") {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Search Query (name, description, or partNumber)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Filter by Price Range
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Filter by Material Type or other specs
    if (materialFilter !== "Todos") {
      const mat = materialFilter.toLowerCase();
      list = list.filter((p) => {
        const materialMatch = p.specs.material?.toLowerCase().includes(mat);
        const dimensionsMatch = p.specs.dimensions?.toLowerCase().includes(mat);
        const compatibilityMatch = p.specs.compatibility?.toLowerCase().includes(mat);
        const pressureMatch = p.specs.pressure?.toLowerCase().includes(mat);
        
        return materialMatch || dimensionsMatch || compatibilityMatch || pressureMatch;
      });
    }

    // Sort Products
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        favorites,
        searchQuery,
        selectedCategory,
        priceRange,
        sortBy,
        materialFilter,
        products,
        setSearchQuery,
        setSelectedCategory,
        setPriceRange,
        setSortBy,
        setMaterialFilter,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        clearFilters,
        getFilteredProducts,
        getCartTotal,
        getCartCount,
        addProduct,
        deleteProduct,
        updateProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
