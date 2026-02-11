import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthContext'
import { CarritoProvider } from './contexts/CarritoContext'
import AppRouter from './app/router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CarritoProvider>
        <AppRouter />
      </CarritoProvider>
    </AuthProvider>
  </StrictMode>,
)
