import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Producto } from '../types/producto';

export interface CarritoItem {
  producto: Producto;
  cantidadKg: number;
}

const CARRITO_STORAGE_PREFIX = 'raucan_carrito_';

function getStorageKey(userId: string | undefined): string {
  return `${CARRITO_STORAGE_PREFIX}${userId ?? 'guest'}`;
}

function loadCarritoFromStorage(storageKey: string): CarritoItem[] {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item: unknown): item is CarritoItem => {
      const i = item as Record<string, unknown>;
      if (!i || typeof i !== 'object' || typeof i.cantidadKg !== 'number' || !i.producto) return false;
      const prod = i.producto as Record<string, unknown>;
      const precio = prod.precioPorKg ?? prod.precio_por_kg;
      return (
        typeof prod.id === 'string' &&
        typeof prod.nombre === 'string' &&
        typeof precio === 'number'
      );
    }).map((item) => {
      const p = item.producto as Producto & { precio_por_kg?: number };
      const precio = p.precioPorKg ?? p.precio_por_kg ?? 0;
      return {
        producto: { ...p, precioPorKg: precio, precio_por_kg: precio } as Producto,
        cantidadKg: item.cantidadKg,
      };
    });
  } catch {
    return [];
  }
}

function saveCarritoToStorage(storageKey: string, items: CarritoItem[]) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  } catch {
    // ignorar errores de almacenamiento
  }
}

interface CarritoContextValue {
  items: CarritoItem[];
  totalItems: number;
  addItem: (producto: Producto, cantidadKg: number) => void;
  removeItem: (productoId: string) => void;
  updateItem: (productoId: string, cantidadKg: number) => void;
  clear: () => void;
}

const CarritoContext = createContext<CarritoContextValue | null>(null);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?.id);
  const [items, setItems] = useState<CarritoItem[]>([]);
  const pendingLoadRef = useRef(false);

  // Al cambiar de usuario (o guest), cargar su carrito
  useEffect(() => {
    pendingLoadRef.current = true;
    setItems(loadCarritoFromStorage(storageKey));
  }, [storageKey]);

  // Persistir cuando cambien los ítems (evitar guardar [] antes de terminar de cargar)
  useEffect(() => {
    if (pendingLoadRef.current) {
      pendingLoadRef.current = false;
      return;
    }
    saveCarritoToStorage(storageKey, items);
  }, [storageKey, items]);

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

  const updateItem = useCallback((productoId: string, cantidadKg: number) => {
    if (cantidadKg <= 0) {
      removeItem(productoId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.producto.id === productoId ? { ...i, cantidadKg } : i
      )
    );
  }, [removeItem]);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((acc, i) => acc + i.cantidadKg, 0);

  const value: CarritoContextValue = {
    items,
    totalItems,
    addItem,
    removeItem,
    updateItem,
    clear,
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return ctx;
}
