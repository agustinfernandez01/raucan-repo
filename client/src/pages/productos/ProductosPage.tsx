import { useState } from "react";
import { useCarrito } from "../../contexts/CarritoContext";
import type { Producto } from "../../types/producto";

const productos = [
  // Perros
  { id: 1, nombre: "Croquetas Premium Adulto", descripcion: "Fórmula equilibrada con pollo y arroz para perros adultos", precio: 1250.00, categoria: "Perros", subcategoria: "Alimento", activo: true, emoji: "🦴" },
  { id: 2, nombre: "Collar Ajustable Cuero", descripcion: "Collar de cuero genuino con hebilla metálica resistente", precio: 890.00, categoria: "Perros", subcategoria: "Accesorios", activo: true, emoji: "🐾" },
  { id: 3, nombre: "Shampoo Hipoalergénico", descripcion: "Shampoo suave para pieles sensibles, sin parabenos", precio: 540.00, categoria: "Perros", subcategoria: "Higiene", activo: true, emoji: "🐾" },
  { id: 4, nombre: "Juguete Cuerda Resistente", descripcion: "Cuerda de algodón trenzado para juegos de tira y afloja", precio: 320.00, categoria: "Perros", subcategoria: "Juguetes", activo: true, emoji: "🎾" },
  // Gatos
  { id: 5, nombre: "Alimento Húmedo Atún", descripcion: "Pâté de atún en salsa, rico en proteínas y omega-3", precio: 420.00, categoria: "Gatos", subcategoria: "Alimento", activo: true, emoji: "🐟" },
  { id: 6, nombre: "Rascador Torre Sisal", descripcion: "Torre multinivel con rascador de sisal y cama incorporada", precio: 3200.00, categoria: "Gatos", subcategoria: "Muebles", activo: true, emoji: "🐱" },
  { id: 7, nombre: "Arena Aglomerante Premium", descripcion: "Arena con carbón activo, máximo control de olores 30 días", precio: 780.00, categoria: "Gatos", subcategoria: "Higiene", activo: true, emoji: "✨" },
  { id: 8, nombre: "Plumas Interactivas", descripcion: "Varita con plumas naturales para estimular el instinto cazador", precio: 280.00, categoria: "Gatos", subcategoria: "Juguetes", activo: true, emoji: "🪶" },
  // Aves
  { id: 9, nombre: "Mix Semillas Tropical", descripcion: "Mezcla de semillas exóticas para loros y cotorras", precio: 560.00, categoria: "Aves", subcategoria: "Alimento", activo: true, emoji: "🌿" },
  { id: 10, nombre: "Jaula Espaciosa Inox", descripcion: "Jaula de acero inoxidable con comederos y bebederos incluidos", precio: 5400.00, categoria: "Aves", subcategoria: "Hábitat", activo: true, emoji: "🏠" },
  // Peces
  { id: 11, nombre: "Alimento en Escamas", descripcion: "Escamas flotantes con vitaminas para peces tropicales", precio: 340.00, categoria: "Peces", subcategoria: "Alimento", activo: true, emoji: "🐠" },
  { id: 12, nombre: "Filtro Acuario 200L", descripcion: "Filtro de alta eficiencia para acuarios de hasta 200 litros", precio: 2100.00, categoria: "Peces", subcategoria: "Equipamiento", activo: true, emoji: "💧" },
  // Pequeños Animales
  { id: 13, nombre: "Heno Timothy Premium", descripcion: "Heno de primera calidad para conejos y cobayas", precio: 480.00, categoria: "Pequeños Animales", subcategoria: "Alimento", activo: true, emoji: "🌾" },
  { id: 14, nombre: "Rueda de Ejercicio Silenciosa", descripcion: "Rueda giratoria silenciosa para hámsters y chinchillas", precio: 760.00, categoria: "Pequeños Animales", subcategoria: "Juguetes", activo: true, emoji: "⚙️" },
];

const categorias = [
  { id: "todas", label: "Todo", icon: "🐾" },
  { id: "Perros", label: "Perros", icon: "🐶" },
  { id: "Gatos", label: "Gatos", icon: "🐱" },
  { id: "Aves", label: "Aves", icon: "🦜" },
  { id: "Peces", label: "Peces", icon: "🐠" },
  { id: "Pequeños Animales", label: "Pequeños", icon: "🐹" },
];

const subcategoriasColor: Record<string, { bg: string; text: string }> = {
  Alimento: { bg: "#fff3e0", text: "#e65100" },
  Accesorios: { bg: "#e8f5e9", text: "#2e7d32" },
  Higiene: { bg: "#e3f2fd", text: "#1565c0" },
  Juguetes: { bg: "#fce4ec", text: "#880e4f" },
  Muebles: { bg: "#f3e5f5", text: "#6a1b9a" },
  Hábitat: { bg: "#e0f2f1", text: "#00695c" },
  Equipamiento: { bg: "#e8eaf6", text: "#283593" },
};

interface ProductoMock {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  subcategoria: string;
  activo: boolean;
  emoji: string;
}

interface AgregadosState {
  [key: number]: boolean;
}

function mockToProducto(p: ProductoMock): Producto {
  return {
    id: String(p.id),
    nombre: p.nombre,
    precioPorKg: p.precio,
    descripcion: p.descripcion,
    categoria: p.categoria,
    unidad: "kg",
  };
}

export default function CatalogoMascotas() {
  const { addItem } = useCarrito();
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [agregados, setAgregados] = useState<AgregadosState>({});

  const productosFiltrados = productos.filter((p) => {
    const matchCat = categoriaActiva === "todas" || p.categoria === categoriaActiva;
    const matchSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAgregar = (prod: ProductoMock): void => {
    addItem(mockToProducto(prod), 1);
    setAgregados((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => setAgregados((prev) => ({ ...prev, [prod.id]: false })), 1200);
  };

  return (
    <div style={{ fontFamily: "'Quicksand', system-ui, sans-serif", background: "linear-gradient(135deg, #e8e8ec 0%, #dfe0e5 100%)", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .cat-btn { border: none; cursor: pointer; transition: all 0.2s; }
        .cat-btn:hover { transform: translateY(-2px); }
        .cat-btn.active { transform: translateY(-2px); }
        .card { transition: transform 0.2s, box-shadow 0.2s; }
        .card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(136,150,252,0.18); }
        .add-btn { border: none; cursor: pointer; transition: all 0.2s; }
        .add-btn:hover { opacity: 0.88; transform: scale(1.04); }
        .add-btn.added { background: #22c55e !important; }
        .search-input:focus { outline: none; border-color: #8896fc; box-shadow: 0 0 0 3px rgba(136,150,252,0.2); }
        .carrito-badge { animation: pop 0.3s; }
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.4); } 100% { transform: scale(1); } }
        @media (max-width: 640px) {
          .header-inner { flex-direction: column; gap: 12px; align-items: flex-start !important; }
          .cat-scroll { overflow-x: auto; padding-bottom: 8px; }
          .cat-scroll::-webkit-scrollbar { height: 4px; }
          .cat-scroll::-webkit-scrollbar-thumb { background: #8896fc44; border-radius: 4px; }
          .grid-productos { grid-template-columns: 1fr 1fr !important; }
          .search-row { flex-direction: column; }
        }
        @media (max-width: 400px) {
          .grid-productos { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #8896fc 0%, #a78bfa 100%)", borderRadius: 20, padding: "32px 36px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 6 }}>CATÁLOGO DE PRODUCTOS</div>
            <h1 style={{ color: "white", fontSize: 28, fontWeight: 900, lineHeight: 1.2, marginBottom: 8 }}>Todo lo que tu mascota<br />necesita 🐾</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, maxWidth: 360 }}>Encontrá alimentos, accesorios, juguetes y más para perros, gatos, aves y pequeños amigos.</p>
          </div>
          <div style={{ fontSize: 80, opacity: 0.9, lineHeight: 1 }}>🐶🐱🦜🐹</div>
        </div>

        {/* Categorias */}
        <div className="cat-scroll" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 10, width: "max-content" }}>
            {categorias.map((cat) => {
              const isActive = categoriaActiva === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`cat-btn${isActive ? " active" : ""}`}
                  onClick={() => setCategoriaActiva(cat.id)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 50,
                    fontFamily: "inherit",
                    fontWeight: 700,
                    fontSize: 14,
                    background: isActive ? "#8896fc" : "white",
                    color: isActive ? "white" : "#6b7280",
                    boxShadow: isActive ? "0 4px 16px rgba(136,150,252,0.35)" : "0 2px 8px rgba(0,0,0,0.07)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 18 }}>{cat.icon}</span>
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resultados count */}
        <div style={{ marginBottom: 20, color: "#9ca3af", fontSize: 13, fontWeight: 600 }}>
          {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} encontrado{productosFiltrados.length !== 1 ? "s" : ""}
          {categoriaActiva !== "todas" && <span style={{ color: "#8896fc" }}> en {categoriaActiva}</span>}
        </div>

        {/* Grid productos */}
        {productosFiltrados.length > 0 ? (
          <div className="grid-productos" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {productosFiltrados.map((prod) => {
              const subColor = subcategoriasColor[prod.subcategoria] || { bg: "#f3f4f6", text: "#6b7280" };
              const isAdded = agregados[prod.id];
              return (
                <div key={prod.id} className="card" style={{ background: "white", borderRadius: 18, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  {/* Card image area */}
                  <div style={{ background: `linear-gradient(135deg, ${subColor.bg} 0%, #f5f7ff 100%)`, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, position: "relative" }}>
                    {prod.emoji}
                    <div style={{ position: "absolute", top: 10, right: 10, background: "white", borderRadius: 50, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer" }}>
                      🤍
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ background: subColor.bg, color: subColor.text, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                        {prod.subcategoria}
                      </span>
                      <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{prod.categoria}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 15, color: "#2D2D2D", marginBottom: 6, lineHeight: 1.3 }}>{prod.nombre}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5, flex: 1, marginBottom: 14 }}>{prod.descripcion}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontWeight: 900, fontSize: 20, color: "#8896fc" }}>
                        ${prod.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                      </div>
                      <button
                        className={`add-btn${isAdded ? " added" : ""}`}
                        onClick={() => handleAgregar(prod)}
                        style={{
                          background: isAdded ? "#22c55e" : "#8896fc",
                          color: "white",
                          borderRadius: 10,
                          padding: "8px 14px",
                          fontSize: 13,
                          fontWeight: 700,
                          fontFamily: "inherit",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
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
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D", marginBottom: 8 }}>No encontramos productos</div>
            <div style={{ color: "#9ca3af", fontSize: 14 }}>Probá con otro término o categoría</div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e5e7eb", marginTop: 60, padding: "24px 20px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
        <span style={{ fontSize: 20 }}>🐾</span>  Raucan — Todo para tus mascotas
      </footer>
    </div>
  );
}