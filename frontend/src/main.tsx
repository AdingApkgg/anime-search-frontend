import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { SerwistProvider } from './serwist'
import { UpdateToast } from '@/components/UpdateToast'

// 单页应用只有根路径：陌生/过期路径（如旧版的 /offline/）统一归位到 /
if (window.location.pathname !== '/') {
  window.history.replaceState(null, '', '/')
}

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
