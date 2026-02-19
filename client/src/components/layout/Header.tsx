import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, ADMIN_ROUTES } from '../../constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { useCarrito } from '../../contexts/CarritoContext';

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCarrito();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkBase: React.CSSProperties = {
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: 10,
    transition: 'all 0.18s',
    whiteSpace: 'nowrap',
  };

  const navLink = (path: string): React.CSSProperties => ({
    ...linkBase,
    color: isActive(path) ? '#8896fc' : '#6b7280',
    background: isActive(path) ? 'rgba(136,150,252,0.08)' : 'transparent',
  });

  const adminLink: React.CSSProperties = {
    ...linkBase,
    color: '#ffa9e0',
    background: isActive(ADMIN_ROUTES.DASHBOARD) ? 'rgba(255,169,224,0.12)' : 'transparent',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        .h-navlink:hover { color: #8896fc !important; background: rgba(136,150,252,0.08) !important; }
        .h-adminlink:hover { color: #d946a8 !important; background: rgba(255,169,224,0.12) !important; }
        .h-logout:hover { color: #e11d48 !important; background: #fff1f2 !important; }
        .h-loginbtn:hover { opacity: 0.88; transform: translateY(-1px); }
        @media (max-width: 640px) {
          .h-desktop { display: none !important; }
          .h-hamburger { display: flex !important; }
        }
        @media (min-width: 641px) {
          .h-mobile-menu { display: none !important; }
          .h-hamburger { display: none !important; }
        }
      `}</style>

      <header style={{
        background: 'white',
        boxShadow: '0 2px 16px rgba(136,150,252,0.10)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
      }}>
        <nav style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 20px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}>

          {/* Logo */}
          <Link to={ROUTES.HOME} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 28 }}>🐾</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: 18, color: '#4d4d4d', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Raucan</div>
              <div style={{ fontSize: 10, color: '#8896fc', fontWeight: 700, letterSpacing: '0.06em', lineHeight: 1 }}>TODO PARA TUS MASCOTAS</div>
            </div>
          </Link>

          {/* Desktop nav — todos los links */}
          <div className="h-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, marginLeft: 24 }}>
            <Link to={ROUTES.PRODUCTOS} className="h-navlink" style={navLink(ROUTES.PRODUCTOS)}>
              Productos
            </Link>

            <Link to={ROUTES.CARRITO} className="h-navlink" style={{ ...navLink(ROUTES.CARRITO), display: 'flex', alignItems: 'center', gap: 6 }}>
              Carrito
              {totalItems > 0 && (
                <span style={{ background: '#ffa9e0', color: 'white', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 900 }}>
                  {totalItems} kg
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link to={ADMIN_ROUTES.DASHBOARD} className="h-adminlink" style={adminLink}>
                ⚙️ Admin
              </Link>
            )}
          </div>

          {/* Desktop auth */}
          <div className="h-desktop" style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.PERFIL}
                  className="h-navlink"
                  style={{ ...navLink(ROUTES.PERFIL), display: 'flex', alignItems: 'center', gap: 7 }}
                >
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8896fc, #ffa9e0)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 900, fontSize: 12, flexShrink: 0,
                  }}>
                    {(user?.nombre ?? user?.email ?? 'U')[0].toUpperCase()}
                  </span>
                  <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.nombre ?? user?.email ?? 'Mi cuenta'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="h-logout"
                  style={{ ...linkBase, color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="h-loginbtn"
                style={{
                  ...linkBase,
                  color: 'white',
                  background: 'linear-gradient(135deg, #8896fc 0%, #a78bfa 100%)',
                  boxShadow: '0 4px 12px rgba(136,150,252,0.3)',
                  padding: '8px 18px',
                }}
              >
                🐾 Entrar
              </Link>
            )}
          </div>

          {/* Mobile: carrito badge + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link to={ROUTES.CARRITO} style={{ textDecoration: 'none', position: 'relative', display: 'flex' }}>
              <span style={{ fontSize: 22 }}>🛒</span>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: -5, right: -5,
                  background: '#ffa9e0', color: 'white', borderRadius: '50%',
                  width: 17, height: 17, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 10, fontWeight: 900,
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="h-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'none', flexDirection: 'column', gap: 4 }}
              aria-label="Menú"
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', width: 22, height: 2.5, background: menuOpen ? '#8896fc' : '#6b7280', borderRadius: 4, transition: 'background 0.18s' }} />
              ))}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div className="h-mobile-menu" style={{
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          borderTop: '1px solid #f3f4f6',
          padding: '12px 20px 16px',
          gap: 4,
          background: 'white',
        }}>
          <Link to={ROUTES.PRODUCTOS} onClick={() => setMenuOpen(false)} className="h-navlink" style={{ ...navLink(ROUTES.PRODUCTOS), display: 'block' }}>
            Productos
          </Link>
          <Link to={ROUTES.CARRITO} onClick={() => setMenuOpen(false)} className="h-navlink" style={{ ...navLink(ROUTES.CARRITO), display: 'flex', alignItems: 'center', gap: 8 }}>
            Carrito
            {totalItems > 0 && (
              <span style={{ background: '#ffa9e0', color: 'white', borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 900 }}>
                {totalItems} kg
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link to={ADMIN_ROUTES.DASHBOARD} onClick={() => setMenuOpen(false)} className="h-adminlink" style={{ ...adminLink, display: 'block' }}>
              ⚙️ Admin
            </Link>
          )}
          <div style={{ height: 1, background: '#f3f4f6', margin: '6px 0' }} />
          {isAuthenticated ? (
            <>
              <Link to={ROUTES.PERFIL} onClick={() => setMenuOpen(false)} className="h-navlink" style={{ ...navLink(ROUTES.PERFIL), display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #8896fc, #ffa9e0)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 12 }}>
                  {(user?.nombre ?? user?.email ?? 'U')[0].toUpperCase()}
                </span>
                {user?.nombre ?? user?.email ?? 'Mi cuenta'}
              </Link>
              <button
                type="button"
                onClick={() => { logout(); setMenuOpen(false); }}
                className="h-logout"
                style={{ ...linkBase, color: '#9ca3af', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                Salir
              </button>
            </>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              onClick={() => setMenuOpen(false)}
              style={{ ...linkBase, color: 'white', background: 'linear-gradient(135deg, #8896fc, #a78bfa)', textAlign: 'center', display: 'block', marginTop: 4 }}
            >
              🐾 Entrar
            </Link>
          )}
        </div>
      </header>
    </>
  );
}