import React, { useState } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [telefono, setTelefono] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/auth", {
        email: email,
        password: password,
        telefono: telefono
      });
      if (!response) {
        console.error("Error en la respuesta del servidor:", response);
        setError("Datos de inicio de sesión incorrectos. Por favor, verifica tu correo, teléfono y contraseña.");
        return;
      }
      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    /* 
      En desktop: ocupa toda la pantalla, el card se centra con un ancho máximo grande.
      En mobile: el card se apila verticalmente y ocupa casi todo el ancho.
    */
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f5f7ff] to-[#fff9f0] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">

        {/* Card del login */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 xl:p-12">

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block p-3 bg-[#8896fc] bg-opacity-10 rounded-xl mb-4">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-[#8896fc]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#4d4d4d]">Bienvenido</h2>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Inicia sesión en tu cuenta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-medium text-[#4d4d4d] mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none text-sm sm:text-base"
                placeholder="tu@email.com"
              />
            </div>

            {/* Teléfono Input */}
            <div>
              <label
                htmlFor="telefono"
                className="block text-sm sm:text-base font-medium text-[#4d4d4d] mb-2"
              >
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none text-sm sm:text-base"
                placeholder="Ej: 1123456789"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-medium text-[#4d4d4d] mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none pr-12 text-sm sm:text-base"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8896fc] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm sm:text-base">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#8896fc] focus:ring-[#8896fc] cursor-pointer"
                />
                <span className="ml-2 text-[#4d4d4d]">Recordarme</span>
              </label>
              <a href="#" className="text-[#8896fc] hover:text-[#ffa9e0] transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#8896fc] text-white font-medium rounded-lg hover:bg-opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8896fc] focus:ring-offset-2 text-sm sm:text-base"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center mt-6 text-sm sm:text-base text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="#" className="text-[#8896fc] hover:text-[#ffa9e0] font-medium transition-colors">
              Regístrate aquí
            </a>
          </p>
        </div>

        {/* Footer text */}
        <p className="text-center mt-6 text-gray-400 text-sm">
          © 2024 - Todos los derechos reservados
        </p>
      </div>
    </div>
  );
};

export default Login;