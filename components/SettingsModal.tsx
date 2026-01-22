'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Server, Image, Palette, CircleDot, RotateCcw, X, Settings } from 'lucide-react'
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
      className="max-w-lg w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col max-sm:max-h-full"
      fullscreenOnMobile
    >
      {/* 自定义 Header */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Settings size={20} className="text-primary" />
          设置
        </div>
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
          <div className="grid gap-3 p-3">
            <RepoCard name="anime-search-frontend" index={0} />
            <RepoCard name="anime-search-api" index={1} />
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

// 生成 SHA-256 hash
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 获取当前日期的 YYMMDD 格式
function getDateString(): string {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(-2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `${yy}${mm}${dd}` // 例如 "260122"
}

// GitHub 仓库卡片 - 使用 OpenGraph 图片
function RepoCard({
  name,
  index = 0
}: {
  name: string
  index?: number
}) {
  const [hashTimestamp, setHashTimestamp] = useState<string>('')

  useEffect(() => {
    // 使用当前日期 YYMMDD 格式生成 hash
    const dateStr = getDateString()
    sha256(dateStr).then(setHashTimestamp)
  }, [])

  const imageUrl = hashTimestamp 
    ? `https://opengraph.githubassets.com/${hashTimestamp}/AdingApkgg/${name}`
    : ''

  return (
    <motion.a
      href={`https://github.com/AdingApkgg/${name}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden border border-border/40 hover:border-primary/40 transition-all"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 + index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${name} repository`}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full aspect-[2/1] bg-muted animate-pulse" />
      )}
    </motion.a>
  )
}
