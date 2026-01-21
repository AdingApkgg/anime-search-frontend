'use client'

import { motion } from 'framer-motion'
import { Volume2, Server, Image, ExternalLink, Palette, CircleDot, RotateCcw, X } from 'lucide-react'
import { playTransitionUp, playTransitionDown, playTap, setSoundEnabled } from '@/lib/sound'
import { useUIStore, DEFAULT_BG_API } from '@/stores/ui'
import { Modal, ModalContent } from '@/components/ui/modal'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

const DEFAULT_API_URL = 'https://anime-search.saop.cc'

export function SettingsModal() {
  const {
    showSettings, closeSettings,
    soundEnabled, setSoundEnabled: setStoreSoundEnabled,
    customApiUrl, setCustomApiUrl,
    bgSettings, setBgSettings,
    themeHue, setThemeHue,
    uiOpacity, setUIOpacity,
    resetSettings
  } = useUIStore()

  const handleClose = () => {
    playTransitionDown()
    closeSettings()
  }

  const handleSoundChange = (enabled: boolean) => {
    setSoundEnabled(enabled)
    setStoreSoundEnabled(enabled)
    if (enabled) {
      playTransitionUp()
    }
  }

  const handleThemeHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setThemeHue(value)
  }

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setUIOpacity(value)
  }

  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomApiUrl(e.target.value)
  }

  const handleBgApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBgSettings({ ...bgSettings, apiUrl: e.target.value })
  }

  const handleReset = () => {
    playTap()
    resetSettings()
  }

  return (
    <Modal
      open={showSettings}
      onClose={handleClose}
      className="max-w-lg w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col"
    >
      {/* 自定义 Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b">
        <div className="text-lg font-semibold">⚙️ 设置</div>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                className="size-8 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
                onClick={handleReset}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RotateCcw size={16} />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>重置所有设置</TooltipContent>
          </Tooltip>
          <motion.button
            className="size-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            onClick={handleClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        </div>
      </div>
      
      <ModalContent className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* 外观设置 */}
        <SettingsSection title="外观" index={0}>
          {/* 主题色 */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Palette size={18} className="text-primary" />
                主题色
              </div>
              <div 
                className="size-6 rounded-full ring-2 ring-offset-2 ring-offset-background ring-primary"
                style={{ backgroundColor: `oklch(0.65 0.19 ${themeHue})` }}
              />
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={themeHue}
              onChange={handleThemeHueChange}
              className="w-full h-3 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
              style={{
                background: `linear-gradient(to right, 
                  oklch(0.65 0.19 0), 
                  oklch(0.65 0.19 60), 
                  oklch(0.65 0.19 120), 
                  oklch(0.65 0.19 180), 
                  oklch(0.65 0.19 240), 
                  oklch(0.65 0.19 300), 
                  oklch(0.65 0.19 360))`
              }}
            />
          </div>

          <div className="border-t border-border/50" />

          {/* 透明度 */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CircleDot size={18} className="text-primary" />
                界面透明度
              </div>
              <span className="text-sm text-muted-foreground tabular-nums">{uiOpacity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={uiOpacity}
              onChange={handleOpacityChange}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>更透明</span>
              <span>更实心</span>
            </div>
          </div>
        </SettingsSection>

        {/* 偏好设置 */}
        <SettingsSection title="偏好" index={1}>
          <SettingsItem
            icon={<Volume2 size={20} />}
            title="交互音效"
            description="按钮点击音效反馈"
            action={
              <Switch
                checked={soundEnabled}
                onCheckedChange={handleSoundChange}
              />
            }
          />
        </SettingsSection>

        {/* API 设置 */}
        <SettingsSection title="高级设置" index={2}>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Server size={18} className="text-primary" />
              API 后端
            </div>
            <Input
              type="url"
              value={customApiUrl}
              onChange={handleApiUrlChange}
              placeholder={DEFAULT_API_URL}
              className="h-10"
            />
          </div>
          
          <div className="border-t border-border/50" />
          
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Image size={18} className="text-primary" />
              背景图 API
            </div>
            <Input
              type="url"
              value={bgSettings.apiUrl}
              onChange={handleBgApiChange}
              placeholder={DEFAULT_BG_API}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">修改后刷新页面生效</p>
          </div>
        </SettingsSection>

        {/* 关于 */}
        <SettingsSection title="关于项目" index={3}>
          <div className="grid gap-3 p-1">
            <RepoCard
              name="anime-search-frontend"
              description="动漫聚合搜索前端"
              language="TypeScript"
              languageColor="#3178c6"
              index={0}
            />
            <RepoCard
              name="anime-search-api"
              description="动漫聚合搜索 API"
              language="Rust"
              languageColor="#dea584"
              index={1}
            />
          </div>
        </SettingsSection>
      </ModalContent>
    </Modal>
  )
}

// 设置区块
function SettingsSection({ 
  title, 
  children, 
  index = 0 
}: { 
  title: string
  children: React.ReactNode
  index?: number 
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
        {title}
      </h3>
      <div className="rounded-2xl overflow-hidden divide-y divide-border/30 glass-muted">
        {children}
      </div>
    </motion.section>
  )
}

// 设置项（带开关）
function SettingsItem({
  icon,
  title,
  description,
  action
}: {
  icon: React.ReactNode
  title: string
  description?: string
  action: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="size-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-foreground">{title}</div>
          {description && (
            <div className="text-sm text-muted-foreground">{description}</div>
          )}
        </div>
      </div>
      <div className="flex-shrink-0">{action}</div>
    </div>
  )
}

// GitHub 仓库卡片
function RepoCard({
  name,
  description,
  language,
  languageColor,
  index = 0
}: {
  name: string
  description: string
  language: string
  languageColor: string
  index?: number
}) {
  return (
    <motion.a
      href={`https://github.com/AdingApkgg/${name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 p-3.5 rounded-xl border border-border/40 hover:border-primary/40 transition-all glass-background hover:glass-bg"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="size-10 rounded-xl bg-[#24292f]/90 dark:bg-[#f0f6fc]/10 flex items-center justify-center flex-shrink-0">
        <svg width={20} height={20} viewBox="0 0 16 16" fill="currentColor" className="text-white dark:text-[#f0f6fc]">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
        </svg>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {name}
          </span>
          <ExternalLink size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
        <div className="text-sm text-muted-foreground truncate">{description}</div>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
        <span 
          className="size-2.5 rounded-full" 
          style={{ backgroundColor: languageColor }} 
        />
        <span className="hidden sm:inline">{language}</span>
      </div>
    </motion.a>
  )
}
