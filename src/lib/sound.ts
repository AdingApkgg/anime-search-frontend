// 音效系统 - 使用 Web Audio API

const STORAGE_KEY = 'anime-search-sound'

let audioContext: AudioContext | null = null
let soundEnabled = true

// 初始化
function getAudioContext(): AudioContext {
  audioContext ??= new AudioContext()
  return audioContext
}

// 获取音效启用状态
export function isSoundEnabled(): boolean {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved !== null) {
    soundEnabled = saved === 'true'
  }
  return soundEnabled
}

// 设置音效启用状态
export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled
  localStorage.setItem(STORAGE_KEY, String(enabled))
}

// 播放音效的基础函数
function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
  if (!isSoundEnabled()) return

  try {
    const ctx = getAudioContext()

    // 创建振荡器
    const oscillator = ctx.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    // 创建增益节点（音量控制）
    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    // 连接节点
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // 播放
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch {
    // 忽略音频上下文错误
  }
}

// 点击音效
export function playTap() {
  playTone(800, 0.08, 'sine', 0.08)
}

// 按钮音效（更明显）
export function playButton() {
  playTone(600, 0.1, 'triangle', 0.1)
  setTimeout(() => { playTone(900, 0.08, 'sine', 0.06); }, 30)
}

// 开关切换音效
export function playToggle() {
  playTone(500, 0.06, 'sine', 0.08)
  setTimeout(() => { playTone(700, 0.08, 'sine', 0.06); }, 40)
}

// 面板打开音效
export function playTransitionUp() {
  playTone(400, 0.12, 'sine', 0.06)
  setTimeout(() => { playTone(600, 0.1, 'sine', 0.05); }, 50)
  setTimeout(() => { playTone(800, 0.08, 'sine', 0.04); }, 100)
}

// 面板关闭音效
export function playTransitionDown() {
  playTone(800, 0.08, 'sine', 0.04)
  setTimeout(() => { playTone(600, 0.1, 'sine', 0.05); }, 50)
  setTimeout(() => { playTone(400, 0.12, 'sine', 0.06); }, 100)
}

// 成功音效
export function playSuccess() {
  playTone(523, 0.1, 'sine', 0.1) // C5
  setTimeout(() => { playTone(659, 0.1, 'sine', 0.1); }, 100) // E5
  setTimeout(() => { playTone(784, 0.15, 'sine', 0.08); }, 200) // G5
}

// 错误/警告音效
export function playCaution() {
  playTone(200, 0.2, 'sawtooth', 0.08)
  setTimeout(() => { playTone(180, 0.2, 'sawtooth', 0.06); }, 150)
}

// 通知音效
export function playNotification() {
  playTone(880, 0.1, 'sine', 0.08)
  setTimeout(() => { playTone(1100, 0.12, 'sine', 0.06); }, 80)
}

// 选择音效
export function playSelect() {
  playTone(600, 0.06, 'triangle', 0.08)
}

// 滑动音效
export function playSwipe() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => { playTone(400 + i * 100, 0.03, 'sine', 0.03); }, i * 15)
  }
}
