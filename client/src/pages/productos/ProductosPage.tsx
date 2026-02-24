<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useState, useEffect } from "react";
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
import { useCarrito } from "../../contexts/CarritoContext";
import { getProductos } from "../../services/productos";
import type { Producto } from "../../types/producto";
import type { CategoriaProducto } from "../../types/categoria_producto";
import { getProductos } from "../../services/productos";
import { getCategorias } from "../../services/categorias";

<<<<<<< HEAD
type AgregadosState = Record<string, boolean>;

// Emojis y colores por categoría (decorativos, basados en el nombre)
const CATEGORIA_STYLES: Record<string, { emoji: string; color: string; light: string }> = {
  default: { emoji: "🛍️", color: "#8896fc", light: "#eef0ff" },
};

function getCatStyle(nombre: string) {
  const lower = nombre.toLowerCase();
  if (lower.includes("perro") || lower.includes("dog"))
    return { emoji: "🐶", color: "#f59e0b", light: "#fef3c7" };
  if (lower.includes("gato") || lower.includes("cat"))
    return { emoji: "🐱", color: "#ec4899", light: "#fce7f3" };
  if (lower.includes("ave") || lower.includes("pájaro") || lower.includes("bird"))
    return { emoji: "🦜", color: "#10b981", light: "#d1fae5" };
  if (lower.includes("pez") || lower.includes("acuario") || lower.includes("fish"))
    return { emoji: "🐟", color: "#06b6d4", light: "#cffafe" };
  if (lower.includes("roedor") || lower.includes("conejo") || lower.includes("hamster"))
    return { emoji: "🐹", color: "#8b5cf6", light: "#ede9fe" };
  if (lower.includes("accesorio") || lower.includes("juguete"))
    return { emoji: "🎾", color: "#f97316", light: "#ffedd5" };
  if (lower.includes("alimento") || lower.includes("comida"))
    return { emoji: "🥩", color: "#ef4444", light: "#fee2e2" };
  return CATEGORIA_STYLES.default;
}

function getPrecio(prod: Producto): number {
  return prod.precioPorKg ?? prod.precio_por_kg ?? 0;
}

export default function ProductosPage() {
  const { addItem } = useCarrito();
  const [categoriaActiva, setCategoriaActiva] = useState<number | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
=======
const categorias = [
  { id: "todas", label: "Todo", icon: "🐾" },
  { id: "Perros", label: "Perros", icon: "🐶" },
  { id: "Gatos", label: "Gatos", icon: "🐱" },
];

interface AgregadosState {
  [key: string]: boolean;
}

function getEmojiForCategoria(categoria?: string): string {
  if (!categoria) return "🐾";
  const lower = categoria.toLowerCase();
  if (lower.includes("perro")) return "🐶";
  if (lower.includes("gato")) return "🐱";
  return "🐾";
}

function getCategoriaColor(categoria?: string): { bg: string; text: string } {
  if (!categoria) return { bg: "#f3f4f6", text: "#6b7280" };
  const lower = categoria.toLowerCase();
  if (lower.includes("perro")) return { bg: "#fff3e0", text: "#e65100" };
  if (lower.includes("gato")) return { bg: "#e3f2fd", text: "#1565c0" };
  return { bg: "#f3f4f6", text: "#6b7280" };
}

export default function CatalogoMascotas() {
  const { addItem } = useCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
  const [agregados, setAgregados] = useState<AgregadosState>({});
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategorias().then(setCategorias);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProductos(categoriaActiva).then((data) => {
      setProductos(data);
      setLoading(false);
    });
  }, [categoriaActiva]);

  useEffect(() => {
    setLoading(true);
    getProductos()
      .then((data) => setProductos(data))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, []);

  const productosFiltrados = productos.filter((p) => {
<<<<<<< HEAD
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(term) ||
      (p.descripcion?.toLowerCase().includes(term) ?? false) ||
      (p.categoria_producto?.nombre.toLowerCase().includes(term) ?? false)
    );
=======
    if (categoriaActiva === "todas") return true;
    const cat = p.categoria?.toLowerCase() || "";
    return cat.includes(categoriaActiva.toLowerCase());
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
  });

  const handleAgregar = (prod: Producto): void => {
    addItem(prod, 1);
    setAgregados((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => setAgregados((prev) => ({ ...prev, [prod.id]: false })), 1400);
  };

  const catActivaNombre =
    categoriaActiva !== undefined
      ? categorias.find((c) => c.id === categoriaActiva)?.nombre
      : undefined;

  return (
<<<<<<< HEAD
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f4f5f9", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cat-btn {
          border: 2px solid transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.18s ease;
          white-space: nowrap;
        }
=======
    <div style={{ fontFamily: "'Quicksand', system-ui, sans-serif", background: "linear-gradient(135deg, #e8e8ec 0%, #dfe0e5 100%)", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cat-btn { border: none; cursor: pointer; transition: all 0.2s; }
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
        .cat-btn:hover { transform: translateY(-2px); }
        .cat-btn.active { transform: translateY(-2px); }

        .product-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.11);
        }

        .add-btn {
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 700;
          transition: all 0.18s ease;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .add-btn:hover { opacity: 0.88; transform: scale(1.04); }
        .add-btn.added { background: #22c55e !important; }

        .search-input {
          font-family: 'DM Sans', sans-serif;
          border: 2px solid #e5e7eb;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
        }
        .search-input:focus {
          border-color: #8896fc;
          box-shadow: 0 0 0 4px rgba(136,150,252,0.15);
        }

        .skeleton {
          background: linear-gradient(90deg, #ececec 25%, #f8f8f8 50%, #ececec 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .cat-scroll { overflow-x: auto; padding-bottom: 6px; }
        .cat-scroll::-webkit-scrollbar { height: 3px; }
        .cat-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }

        @media (max-width: 640px) {
          .grid-productos { grid-template-columns: 1fr 1fr !important; }
          .hero-inner { flex-direction: column; gap: 0; }
        }
        @media (max-width: 400px) {
          .grid-productos { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 20px 60px" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
          borderRadius: 24,
          padding: "40px 44px",
          marginBottom: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          position: "relative",
          overflow: "hidden",
        }}
          className="hero-inner"
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -40, right: 140, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, right: 60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", borderRadius: 50, padding: "4px 14px", color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 14 }}>
              CATÁLOGO RAUCAN
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", color: "white", fontSize: 34, fontWeight: 800, lineHeight: 1.15, marginBottom: 12, fontStyle: "italic" }}>
              Todo lo que tu mascota<br />necesita 🐾
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.6, maxWidth: 380 }}>
              Alimentos de calidad por kg para perros, gatos, aves y más. Siempre fresco, siempre natural.
            </p>
          </div>
          <div style={{ fontSize: 72, lineHeight: 1, position: "relative", zIndex: 1, flexShrink: 0 }}>🐶🐱🦜🐟</div>
        </div>

        {/* Search + categorías */}
        <div style={{ marginBottom: 28 }}>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 20, maxWidth: 480 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 17, pointerEvents: "none" }}>🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 46px",
                borderRadius: 50,
                fontSize: 14,
                background: "white",
                color: "#1e1b4b",
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "#e5e7eb", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Categorías */}
          <div className="cat-scroll">
            <div style={{ display: "flex", gap: 10, width: "max-content" }}>
              {/* Botón "Todas" */}
              <button
                className={`cat-btn${categoriaActiva === undefined ? " active" : ""}`}
                onClick={() => setCategoriaActiva(undefined)}
                style={{
                  padding: "9px 20px",
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 700,
                  background: categoriaActiva === undefined ? "#1e1b4b" : "white",
                  color: categoriaActiva === undefined ? "white" : "#6b7280",
                  boxShadow: categoriaActiva === undefined
                    ? "0 4px 16px rgba(30,27,75,0.3)"
                    : "0 2px 8px rgba(0,0,0,0.07)",
                  borderColor: "transparent",
                }}
              >
                🏷️ Todas
              </button>

              {categorias.map((cat) => {
                const isActive = categoriaActiva === cat.id;
                const style = getCatStyle(cat.nombre);
                return (
                  <button
                    key={cat.id}
                    className={`cat-btn${isActive ? " active" : ""}`}
                    onClick={() => setCategoriaActiva(cat.id)}
                    style={{
                      padding: "9px 20px",
                      borderRadius: 50,
                      fontSize: 13,
                      fontWeight: 700,
                      background: isActive ? style.color : "white",
                      color: isActive ? "white" : "#6b7280",
                      boxShadow: isActive
                        ? `0 4px 16px ${style.color}55`
                        : "0 2px 8px rgba(0,0,0,0.07)",
                      borderColor: "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{style.emoji}</span>
                    {cat.nombre}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contador resultados */}
        {!loading && (
          <div className="fade-in" style={{ marginBottom: 20, color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
            {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""}
            {catActivaNombre && (
              <span style={{ color: "#4338ca" }}> en {catActivaNombre}</span>
            )}
            {searchTerm && (
              <span style={{ color: "#4338ca" }}> · "{searchTerm}"</span>
            )}
          </div>
        )}

        {/* Skeletons mientras carga */}
        {loading && (
          <div className="grid-productos" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <div className="skeleton" style={{ height: 140 }} />
                <div style={{ padding: 16 }}>
                  <div className="skeleton" style={{ height: 14, marginBottom: 10, width: "60%" }} />
                  <div className="skeleton" style={{ height: 18, marginBottom: 8, width: "85%" }} />
                  <div className="skeleton" style={{ height: 12, marginBottom: 6, width: "100%" }} />
                  <div className="skeleton" style={{ height: 12, marginBottom: 16, width: "70%" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className="skeleton" style={{ height: 24, width: 80 }} />
                    <div className="skeleton" style={{ height: 36, width: 100, borderRadius: 10 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid productos */}
<<<<<<< HEAD
        {!loading && productosFiltrados.length > 0 && (
          <div className="grid-productos fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {productosFiltrados.map((prod) => {
              const catNombre = prod.categoria_producto?.nombre ?? "";
              const style = getCatStyle(catNombre);
=======
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: "spin 1s linear infinite" }}>⏳</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#6b7280" }}>Cargando productos...</div>
          </div>
        ) : productosFiltrados.length > 0 ? (
          <div className="grid-productos" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {productosFiltrados.map((prod) => {
              const catColor = getCategoriaColor(prod.categoria);
              const emoji = getEmojiForCategoria(prod.categoria);
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
              const isAdded = agregados[prod.id];
              const precio = getPrecio(prod);

              return (
<<<<<<< HEAD
                <div key={prod.id} className="product-card">
                  {/* Imagen / emoji area */}
                  <div style={{
                    background: `linear-gradient(135deg, ${style.light} 0%, #f8f9ff 100%)`,
                    height: 148,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 64,
                    position: "relative",
                  }}>
                    {prod.imagen_url ? (
                      <img
                        src={prod.imagen_url}
                        alt={prod.nombre}
                        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{style.emoji}</span>
                    )}
                    {/* Badge kg */}
                    <div style={{
                      position: "absolute",
                      bottom: 10,
                      left: 12,
                      background: "rgba(255,255,255,0.92)",
                      borderRadius: 8,
                      padding: "3px 9px",
                      fontSize: 10,
                      fontWeight: 800,
                      color: style.color,
                      backdropFilter: "blur(4px)",
                    }}>
                      por kg
=======
                <div key={prod.id} className="card" style={{ background: "white", borderRadius: 18, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {/* Card image area */}
                  <div style={{ background: `linear-gradient(135deg, ${catColor.bg} 0%, #f5f7ff 100%)`, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
                    {emoji}
                    <div style={{ position: "absolute", top: 10, right: 10, background: "white", borderRadius: 50, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer" }}>
                      🤍
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
                    </div>
                  </div>

                  {/* Card body */}
<<<<<<< HEAD
                  <div style={{ padding: "16px 16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Categoría badge */}
                    {catNombre && (
                      <div style={{ marginBottom: 8 }}>
                        <span style={{
                          background: style.light,
                          color: style.color,
                          borderRadius: 20,
                          padding: "3px 10px",
                          fontSize: 11,
                          fontWeight: 700,
                        }}>
                          {style.emoji} {catNombre}
                        </span>
                      </div>
                    )}

                    <div style={{ fontWeight: 800, fontSize: 15, color: "#1e1b4b", marginBottom: 6, lineHeight: 1.3 }}>
                      {prod.nombre}
                    </div>

                    {prod.descripcion && (
                      <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.55, flex: 1, marginBottom: 14 }}>
                        {prod.descripcion}
                      </div>
                    )}

                    <div style={{ flex: 1 }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: 20, color: "#4338ca", lineHeight: 1 }}>
                          ${precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                        </div>
                        <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginTop: 2 }}>por kg</div>
=======
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ background: catColor.bg, color: catColor.text, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                        BARF
                      </span>
                      <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{prod.categoria || "General"}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#2D2D2D", marginBottom: 6, lineHeight: 1.3 }}>{prod.nombre}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5, flex: 1, marginBottom: 14 }}>{prod.descripcion || "Alimento natural para tu mascota"}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 900, fontSize: 20, color: "#8896fc" }}>
                        ${prod.precioPorKg.toLocaleString("es-AR", { minimumFractionDigits: 2 })}<span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>/kg</span>
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
                      </div>
                      <button
                        className={`add-btn${isAdded ? " added" : ""}`}
                        onClick={() => handleAgregar(prod)}
                        style={{
                          background: isAdded ? "#22c55e" : "#4338ca",
                          color: "white",
                          borderRadius: 11,
                          padding: "9px 15px",
                          fontSize: 13,
                          fontFamily: "inherit",
                        }}
                      >
                        {isAdded ? "✓ Agregado" : "+ Agregar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
<<<<<<< HEAD
        )}

        {/* Empty state */}
        {!loading && productosFiltrados.length === 0 && (
          <div className="fade-in" style={{ textAlign: "center", padding: "90px 20px" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🔍</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 800, color: "#1e1b4b", marginBottom: 10, fontStyle: "italic" }}>
              No encontramos productos
            </div>
            <div style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>
              Probá con otro término o seleccioná otra categoría
            </div>
            <button
              onClick={() => { setCategoriaActiva(undefined); setSearchTerm(""); }}
              style={{
                background: "#4338ca",
                color: "white",
                border: "none",
                borderRadius: 50,
                padding: "11px 26px",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
              }}
            >
              Ver todos los productos
            </button>
=======
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D", marginBottom: 8 }}>No encontramos productos</div>
            <div style={{ color: "#9ca3af", fontSize: 14 }}>Probá con otro término o categoría</div>
>>>>>>> c68e60eec249b95d81c05e3ddb309e7faa71df16
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px 20px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
        <span style={{ fontSize: 18 }}>🐾</span>  Raucan — Todo para tus mascotas
      </footer>
    </div>
  );
}