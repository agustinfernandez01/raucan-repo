import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5]" style={{ fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Hero al estilo Productos */}
        <div className="rounded-[20px] px-6 py-6 mb-8 bg-gradient-to-r from-raucan-lavanda to-[#a78bfa]">
          <div className="text-white/90 text-[13px] font-bold tracking-widest uppercase mb-1">Mi perfil</div>
          <h1 className="text-white text-2xl md:text-[28px] font-extrabold leading-tight">
            Tu cuenta en Raucan
          </h1>
          <p className="text-white/80 text-sm mt-1">
            Gestioná tus datos y preferencias.
          </p>
        </div>

        {/* Card Mis mascotas - estilo Productos */}
        <Link
          to={ROUTES.MASCOTAS}
          className="block bg-white rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.07)] p-5 hover:shadow-[0_12px_40px_rgba(136,150,252,0.18)] hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 text-2xl bg-gradient-to-br from-raucan-rosa/25 to-raucan-lavanda/20">
              🐕
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-extrabold text-raucan-gris text-[15px] leading-tight">Mis mascotas</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">Ver y gestionar las mascotas de tu familia</p>
            </div>
            <span className="text-raucan-lavanda font-bold text-sm shrink-0">Ir →</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
