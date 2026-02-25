// src/pages/productos/ProductoDetailPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProductoById } from "../../services/productos";
import { useCarrito } from "../../contexts/CarritoContext";
import { ROUTES } from "../../constants/routes";
import type { Producto } from "../../types/producto";

const CATEGORIA_STYLES: Record<string, { emoji: string; color: string; light: string }> = {
  default: { emoji: "🛍️", color: "#8896fc", light: "#eef0ff" },
};

function getCatStyle(nombre?: string) {
  const n = (nombre ?? "").toLowerCase();
  if (n.includes("perro") || n.includes("dog")) return { emoji: "🐶", color: "#f59e0b", light: "#fef3c7" };
  if (n.includes("gato") || n.includes("cat")) return { emoji: "🐱", color: "#ec4899", light: "#fce7f3" };
  if (n.includes("ave") || n.includes("pájaro") || n.includes("bird")) return { emoji: "🦜", color: "#10b981", light: "#d1fae5" };
  if (n.includes("pez") || n.includes("acuario") || n.includes("fish")) return { emoji: "🐟", color: "#06b6d4", light: "#cffafe" };
  if (n.includes("roedor") || n.includes("conejo") || n.includes("hamster")) return { emoji: "🐹", color: "#8b5cf6", light: "#ede9fe" };
  if (n.includes("accesorio") || n.includes("juguete")) return { emoji: "🎾", color: "#f97316", light: "#ffedd5" };
  if (n.includes("alimento") || n.includes("comida")) return { emoji: "🥩", color: "#ef4444", light: "#fee2e2" };
  return CATEGORIA_STYLES.default;
}

function getPrecio(prod: Producto | null): number {
  if (!prod) return 0;
  return (prod as { precioPorKg?: number; precio_por_kg?: number; precio?: number }).precioPorKg
    ?? (prod as { precio_por_kg?: number }).precio_por_kg
    ?? (prod as { precio?: number }).precio
    ?? 0;
}

export default function ProductoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCarrito();
  const [loading, setLoading] = useState(true);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidadKg, setCantidadKg] = useState(1);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    if (!id) {
      setProducto(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getProductoById(Number(id))
      .then((data) => setProducto(data))
      .catch(() => setProducto(null))
      .finally(() => setLoading(false));
  }, [id]);

  const catNombre =
    producto?.categoria_producto?.nombre ?? (producto as { categoria?: string })?.categoria ?? "";
  const catStyle = useMemo(() => getCatStyle(catNombre), [catNombre]);
  const precio = useMemo(() => getPrecio(producto), [producto]);

  // Normalizar producto para el carrito (id string, precioPorKg)
  const productoParaCarrito = useMemo((): Producto | null => {
    if (!producto) return null;
    const p = producto as Producto & { id?: string | number };
    const idVal = p.id ?? (producto as unknown as { id?: number }).id;
    return {
      ...p,
      id: String(idVal ?? ""),
      precioPorKg: precio,
      precio_por_kg: precio,
    };
  }, [producto, precio]);

  const stockRaw =
    (producto as { stock?: unknown })?.stock ?? (producto as { cantidad?: unknown })?.cantidad ?? "—";
  const stockNum =
    typeof stockRaw === "number"
      ? stockRaw
      : typeof stockRaw === "string" && /^\d+$/.test(stockRaw)
        ? parseInt(stockRaw, 10)
        : null;
  const maxCantidad = stockNum != null ? Math.max(1, stockNum) : 999;
  const cantidadFinal = Math.max(0.5, Math.min(maxCantidad, cantidadKg));

  const handleAgregar = () => {
    if (!productoParaCarrito || cantidadFinal <= 0) return;
    addItem(productoParaCarrito, cantidadFinal);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  const handleComprarAhora = () => {
    if (!productoParaCarrito || cantidadFinal <= 0) return;
    addItem(productoParaCarrito, cantidadFinal);
    navigate(ROUTES.CARRITO);
  };

  const nombre = producto?.nombre ?? "Producto";
  const descripcion = (producto as { descripcion?: string })?.descripcion ?? "";
  const imagenUrl =
    (producto as { imagen_url?: string })?.imagen_url
    ?? (producto as { imagenUrl?: string })?.imagenUrl
    ?? (producto as { imagen?: string })?.imagen
    ?? "";
  const sku = (producto as { sku?: string })?.sku ?? (producto as { codigo?: string })?.codigo ?? "—";
  const marca = (producto as { marca?: string })?.marca ?? "—";
  const stock = stockRaw;
  const pesoRef = (producto as { pesoRef?: string })?.pesoRef ?? "por kg";

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#f4f5f9", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12px;
          padding: 6px 12px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(6px);
        }
        .card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .btn {
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-weight: 800;
          transition: all 0.18s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          user-select: none;
          text-decoration: none;
        }
        .btn:hover { transform: translateY(-2px); opacity: 0.92; }
        .btn:active { transform: translateY(0px); opacity: 0.98; }
        .btn-primary {
          background: #4338ca;
          color: white;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 14px;
          box-shadow: 0 10px 22px rgba(67,56,202,0.25);
        }
        .btn-ghost {
          background: rgba(255,255,255,0.85);
          color: #1e1b4b;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 13px;
          border: 1px solid rgba(0,0,0,0.08);
        }
        .btn-outline {
          background: white;
          color: #4338ca;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 14px;
          border: 2px solid rgba(67,56,202,0.25);
        }
        .qty {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #f8f9ff;
          border: 2px solid #e5e7eb;
          border-radius: 14px;
          padding: 8px 10px;
        }
        .qty button {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          border: none;
          background: white;
          cursor: pointer;
          font-weight: 900;
          color: #1e1b4b;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
          transition: all .16s ease;
        }
        .qty button:hover { transform: translateY(-1px); }
        .qty span {
          min-width: 26px;
          text-align: center;
          font-weight: 900;
          color: #1e1b4b;
        }
        .skeleton {
          background: linear-gradient(90deg, #ececec 25%, #f8f8f8 50%, #ececec 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .fade-in { animation: fadeIn 0.35s ease; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 22px;
          align-items: start;
        }
        @media (max-width: 980px) {
          .grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 20px 60px" }}>
        {/* TOP BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <Link className="btn btn-ghost" to="/productos">
            ← Volver
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              className="pill"
              style={{
                background: catStyle.light,
                color: catStyle.color,
                borderColor: `${catStyle.color}22`,
              }}
            >
              <span style={{ fontSize: 16 }}>{catStyle.emoji}</span>
              {catNombre || "Categoría"}
            </span>
            <span className="pill" style={{ color: "#6b7280" }}>
              🧾 SKU: {loading ? "…" : sku}
            </span>
          </div>
        </div>

        {/* HERO */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
            borderRadius: 24,
            padding: "26px 28px",
            marginBottom: 22,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -50,
              right: 140,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -80,
              right: 30,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: 50,
                  padding: "4px 14px",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                }}
              >
                DETALLE DE PRODUCTO
              </div>
              <h1
                style={{
                  fontFamily: "'Fraunces', serif",
                  color: "white",
                  fontSize: 30,
                  fontWeight: 900,
                  lineHeight: 1.15,
                  marginBottom: 8,
                  fontStyle: "italic",
                }}
              >
                {loading ? "Cargando..." : nombre}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6, maxWidth: 520 }}>
                {loading
                  ? "Buscando la información del producto..."
                  : "Revisá fotos, descripción y agregalo al carrito en segundos."}
              </p>
            </div>
            <div style={{ fontSize: 54, lineHeight: 1, flexShrink: 0, opacity: 0.95 }}>
              {catStyle.emoji}
            </div>
          </div>
        </div>

        {/* EMPTY */}
        {!loading && !producto && (
          <div className="fade-in" style={{ textAlign: "center", padding: "90px 20px" }}>
            <div style={{ fontSize: 72, marginBottom: 20 }}>🔍</div>
            <div
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 22,
                fontWeight: 800,
                color: "#1e1b4b",
                marginBottom: 10,
                fontStyle: "italic",
              }}
            >
              Producto no encontrado
            </div>
            <div style={{ color: "#9ca3af", fontSize: 14, marginBottom: 24 }}>
              Probá volver al catálogo.
            </div>
            <Link to="/productos" className="btn btn-primary">
              Ver catálogo
            </Link>
          </div>
        )}

        {/* CONTENT */}
        {(loading || producto) && (
          <div className="grid">
            {/* LEFT */}
            <div className="card" style={{ overflow: "hidden" }}>
              {/* IMAGE */}
              <div
                style={{
                  height: 360,
                  background: `linear-gradient(135deg, ${catStyle.light} 0%, #f8f9ff 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {loading ? (
                  <div className="skeleton" style={{ width: "92%", height: "86%" }} />
                ) : imagenUrl ? (
                  <img
                    src={imagenUrl}
                    alt={nombre}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 92 }}>{catStyle.emoji}</div>
                    <div style={{ marginTop: 8, color: "#6b7280", fontWeight: 700, fontSize: 13 }}>
                      Sin imagen por ahora
                    </div>
                  </div>
                )}
                {/* BADGES */}
                <div style={{ position: "absolute", left: 16, bottom: 16, display: "flex", gap: 10 }}>
                  <span
                    className="pill"
                    style={{
                      background: "rgba(255,255,255,0.92)",
                      color: catStyle.color,
                      borderColor: `${catStyle.color}22`,
                    }}
                  >
                    💰 {pesoRef}
                  </span>
                  <span className="pill" style={{ color: "#6b7280" }}>
                    📦 Stock: {loading ? "…" : String(stock)}
                  </span>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div style={{ padding: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 14,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <div style={{ color: "#9ca3af", fontWeight: 800, fontSize: 12, letterSpacing: "0.06em" }}>
                      DESCRIPCIÓN
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 16, color: "#1e1b4b", marginTop: 4 }}>
                      Lo que tenés que saber
                    </div>
                  </div>
                  <span
                    className="pill"
                    style={{
                      background: catStyle.light,
                      color: catStyle.color,
                      borderColor: `${catStyle.color}22`,
                    }}
                  >
                    {catStyle.emoji} {catNombre || "Categoría"}
                  </span>
                </div>
                {loading ? (
                  <div>
                    <div className="skeleton" style={{ height: 12, marginBottom: 10, width: "92%" }} />
                    <div className="skeleton" style={{ height: 12, marginBottom: 10, width: "86%" }} />
                    <div className="skeleton" style={{ height: 12, marginBottom: 10, width: "90%" }} />
                    <div className="skeleton" style={{ height: 12, marginBottom: 10, width: "70%" }} />
                  </div>
                ) : (
                  <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.7 }}>
                    {descripcion || "Este producto no tiene descripción todavía."}
                  </p>
                )}
                {/* MINI SPECS */}
                <div
                  style={{
                    marginTop: 16,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    gap: 12,
                  }}
                >
                  {[
                    { label: "Marca", value: marca, icon: "🏷️" },
                    { label: "Formato", value: pesoRef, icon: "⚖️" },
                    { label: "Código", value: sku, icon: "🔖" },
                  ].map((it) => (
                    <div
                      key={it.label}
                      style={{
                        borderRadius: 16,
                        padding: "12px 12px",
                        background: "#f8f9ff",
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <div
                        style={{
                          color: "#9ca3af",
                          fontSize: 11,
                          fontWeight: 900,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {it.icon} {it.label.toUpperCase()}
                      </div>
                      <div style={{ marginTop: 6, color: "#1e1b4b", fontWeight: 900, fontSize: 13 }}>
                        {loading ? "..." : it.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="fade-in" style={{ position: "sticky", top: 18 }}>
              <div className="card" style={{ padding: 18 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ color: "#9ca3af", fontWeight: 900, fontSize: 12, letterSpacing: "0.08em" }}>
                      PRECIO
                    </div>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: 30,
                        color: "#4338ca",
                        lineHeight: 1.05,
                        marginTop: 6,
                      }}
                    >
                      {loading
                        ? "—"
                        : `$${Number(precio || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 800, marginTop: 6 }}>
                      {pesoRef} · Impuestos incluidos
                    </div>
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      background: catStyle.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: catStyle.color,
                      border: `1px solid ${catStyle.color}22`,
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    🛒
                  </div>
                </div>
                <div style={{ marginTop: 16, height: 1, background: "#e5e7eb" }} />

                {/* QTY UI */}
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ color: "#1e1b4b", fontWeight: 900, fontSize: 13 }}>Cantidad</div>
                    <div style={{ color: "#9ca3af", fontWeight: 800, fontSize: 12 }}>Máx. según stock</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div className="qty">
                      <button
                        type="button"
                        aria-label="disminuir"
                        disabled={loading || cantidadKg <= 0.5}
                        onClick={() => setCantidadKg((q) => Math.max(0.5, q - 1))}
                      >
                        −
                      </button>
                      <span>{cantidadKg}</span>
                      <button
                        type="button"
                        aria-label="aumentar"
                        disabled={loading || cantidadKg >= maxCantidad}
                        onClick={() => setCantidadKg((q) => Math.min(maxCantidad, q + 1))}
                      >
                        +
                      </button>
                    </div>
                    <span
                      className="pill"
                      style={{
                        background: "rgba(34,197,94,0.10)",
                        color: "#16a34a",
                        borderColor: "rgba(34,197,94,0.20)",
                      }}
                    >
                      ✅ Disponible
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={loading || !producto || cantidadFinal <= 0}
                    onClick={handleAgregar}
                  >
                    {agregado ? "✓ Agregado" : "+ Agregar al carrito"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={loading || !producto || cantidadFinal <= 0}
                    onClick={handleComprarAhora}
                  >
                    ⚡ Comprar ahora
                  </button>
                </div>

                {/* INFO */}
                <div
                  style={{
                    marginTop: 16,
                    borderRadius: 16,
                    padding: 14,
                    background: "#f8f9ff",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 18 }}>🚚</div>
                    <div>
                      <div style={{ color: "#1e1b4b", fontWeight: 900, fontSize: 13 }}>Entrega y retiro</div>
                      <div style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
                        Coordiná por WhatsApp o retiralo en el local.
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 1, background: "#e5e7eb", margin: "12px 0" }} />
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 18 }}>🛡️</div>
                    <div>
                      <div style={{ color: "#1e1b4b", fontWeight: 900, fontSize: 13 }}>Calidad garantizada</div>
                      <div style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
                        Productos seleccionados para que tu mascota coma mejor y viva mejor 🐾
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER CARD */}
              <div
                className="card"
                style={{
                  marginTop: 14,
                  padding: 16,
                  background:
                    "linear-gradient(135deg, rgba(67,56,202,0.08) 0%, rgba(30,27,75,0.06) 100%)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ color: "#1e1b4b", fontWeight: 900, fontSize: 14 }}>¿Necesitás ayuda?</div>
                    <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>
                      Consultanos y te asesoramos en 2 minutos.
                    </div>
                  </div>
                  <button className="btn btn-ghost" onClick={() => { /* abrir chat */ }}>
                    💬 Chatear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "24px 20px",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: 13,
        }}
      >
        <span style={{ fontSize: 18 }}>🐾</span> Raucan — Todo para tus mascotas
      </footer>
    </div>
  );
}
