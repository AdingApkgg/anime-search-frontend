import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App'

// 单页应用只有根路径：陌生/过期路径（如旧版的 /offline/）统一归位到 /
if (window.location.pathname !== '/') {
  window.history.replaceState(null, '', '/')
}

// SW 注册（autoUpdate：新版本静默激活），并定期检查更新（每 30 分钟）
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (registration) {
      setInterval(() => {
        void registration.update().catch(() => {})
      }, 30 * 60 * 1000)
    }
  }
})

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
