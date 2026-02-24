import React, { useState } from 'react';
import type { UsuarioCreate } from '../../types/usuario';
import { registro } from '../../services/registro';

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#8896fc] focus:ring-2 focus:ring-[#8896fc] focus:ring-opacity-20 transition-all outline-none';

type RegisterForm = UsuarioCreate & {
  confirmPassword: string;
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    rol: 'usuario',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ✅ Confirm password bien hecho (sin tocar tu lógica de registro)
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const payload: UsuarioCreate = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      telefono: formData.telefono,
      rol: formData.rol,
      password: formData.password
    };

    try {
      setLoading(true);

      // ✅ Que se ejecute la función registro (como vos pediste)
      const response = await registro(payload, '/usuarios/post');

      console.log('Registro exitoso:', response);
      setSuccess('Registro exitoso ✅');

      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rol: 'usuario',
        password: '',
        confirmPassword: ''
      });

      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (err: any) {
      const backendMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Error al registrar. Por favor, intenta nuevamente.';

      setError(typeof backendMsg === 'string' ? backendMsg : JSON.stringify(backendMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8e8ec] to-[#dfe0e5] p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-[#2D2D2D]">Crear Cuenta</h2>
            <p className="text-gray-500 mt-1 text-sm">Completa el formulario para registrarte</p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Nombre"
              />

              <input
                name="apellido"
                type="text"
                value={formData.apellido}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Apellido"
              />
            </div>

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder="Correo electrónico"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Teléfono"
              />

              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
                className={inputClass + ' bg-white'}
              >
                <option value="usuario">Usuario</option>
                <option value="administrador">Administrador</option>
                <option value="moderador">Moderador</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password con ojito */}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={inputClass + ' pr-12'}
                  placeholder="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8896fc] transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    // eye-off
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.477 10.485a3 3 0 104.243 4.243"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6.228 6.228C4.6 7.63 3.35 9.65 2.458 12c1.274 4.057 5.064 7 9.542 7 1.253 0 2.45-.23 3.56-.66M14.12 9.88A3 3 0 009.88 14.12"
                      />
                    </svg>
                  ) : (
                    // eye
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Confirm password con ojito */}
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={inputClass + ' pr-12'}
                  placeholder="Confirmar contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8896fc] transition-colors"
                  aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
                >
                  {showConfirmPassword ? (
                    // eye-off
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6.228 6.228C4.6 7.63 3.35 9.65 2.458 12c1.274 4.057 5.064 7 9.542 7 1.253 0 2.45-.23 3.56-.66"
                      />
                    </svg>
                  ) : (
                    // eye
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#8896fc] text-white font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-400 text-sm">© 2024 - Todos los derechos reservados</p>
      </div>
    </div>
  );
};

export default Register;