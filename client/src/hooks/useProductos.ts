import { useState, useEffect, useCallback } from 'react';
import * as productosService from '../services/productos';
import type { Producto } from '../types/producto';

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productosService.getProductos();
      setProductos(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Error al cargar productos'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { productos, loading, error, refetch: load };
}
