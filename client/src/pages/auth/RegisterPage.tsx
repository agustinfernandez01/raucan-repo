import React, { useState } from 'react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: 'usuario',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Aquí se enviarían los datos al backend
    const registroData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      rol: formData.rol,
      activo: true, // Por defecto activo
      password_hash: formData.password, // En el backend se hashearía
      creado_en: new Date().toISOString()
    };

    console.log('Registro attempt:', registroData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f7ff] to-[#fff9f0] p-4">
      <div className="w-full max-w-2xl">
        {/* Card del registro */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-[#8896fc] bg-opacity-10 rounded-lg mb-4">
              <svg 
                className="w-10 h-10 text-[#8896fc]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#4d4d4d]">Crear Cuenta</h2>
            <p className="text-gray-500 mt-1 text-sm">Completa el formulario para registrarte</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre y Apellido en una fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label 
                  htmlFor="nombre" 
                  className="block text-sm font-medium text-[#4d4d4d] mb-2"
                >
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none"
                  placeholder="Juan"
                />
              </div>

              {/* Apellido */}
              <div>
                <label 
                  htmlFor="apellido" 
                  className="block text-sm font-medium text-[#4d4d4d] mb-2"
                >
                  Apellido
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none"
                  placeholder="Pérez"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-[#4d4d4d] mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none"
                placeholder="tu@email.com"
              />
            </div>

            {/* Teléfono y Rol en una fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Teléfono */}
              <div>
                <label 
                  htmlFor="telefono" 
                  className="block text-sm font-medium text-[#4d4d4d] mb-2"
                >
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>

              {/* Rol */}
              <div>
                <label 
                  htmlFor="rol" 
                  className="block text-sm font-medium text-[#4d4d4d] mb-2"
                >
                  Rol
                </label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none bg-white"
                >
                  <option value="usuario">Usuario</option>
                  <option value="administrador">Administrador</option>
                  <option value="moderador">Moderador</option>
                </select>
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label 
                htmlFor="direccion" 
                className="block text-sm font-medium text-[#4d4d4d] mb-2"
              >
                Dirección
              </label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none"
                placeholder="Calle, Ciudad, Provincia"
              />
            </div>

            {/* Contraseña y Confirmar Contraseña */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-[#4d4d4d] mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none pr-12"
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

              {/* Confirmar Password */}
              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-sm font-medium text-[#4d4d4d] mb-2"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8896fc] transition-colors"
                  >
                    {showConfirmPassword ? (
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
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="terms"
                required
                className="w-4 h-4 mt-1 rounded border-gray-300 text-[#8896fc] focus:ring-[#8896fc] cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-[#4d4d4d] cursor-pointer">
                Acepto los{' '}
                <a href="#" className="text-[#8896fc] hover:text-[#ffa9e0] transition-colors">
                  términos y condiciones
                </a>
                {' '}y la{' '}
                <a href="#" className="text-[#8896fc] hover:text-[#ffa9e0] transition-colors">
                  política de privacidad
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#8896fc] text-white font-medium rounded-lg hover:bg-opacity-90 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8896fc] focus:ring-offset-2"
            >
              Crear Cuenta
            </button>
          </form>

          {/* Login link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <a href="#" className="text-[#8896fc] hover:text-[#ffa9e0] font-medium transition-colors">
              Inicia sesión aquí
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

export default Register;