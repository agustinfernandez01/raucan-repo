import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Producto } from '../types/producto';

export interface CarritoItem {
  producto: Producto;
  cantidadKg: number;
}

interface CarritoContextValue {
  items: CarritoItem[];
  totalItems: number;
  addItem: (producto: Producto, cantidadKg: number) => void;
  removeItem: (productoId: string) => void;
  clear: () => void;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CarritoItem[]>([]);

  const addItem = useCallback((producto: Producto, cantidadKg: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.producto.id === producto.id);
      if (existing) {
        return prev.map((i) =>
          i.producto.id === producto.id
            ? { ...i, cantidadKg: i.cantidadKg + cantidadKg }
            : i
        );
      }
      return [...prev, { producto, cantidadKg }];
    });
  }, []);

  const removeItem = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((i) => i.producto.id !== productoId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((acc, i) => acc + i.cantidadKg, 0);

  const value: CarritoContextValue = {
    items,
    totalItems,
    addItem,
    removeItem,
    clear,
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return ctx;
}
