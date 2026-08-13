import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { SerwistProvider } from './serwist'
import { UpdateToast } from '@/components/UpdateToast'

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <SerwistProvider>
        <App />
        <UpdateToast />
      </SerwistProvider>
    </StrictMode>
  )
}
