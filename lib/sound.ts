// 音效系统 - 使用 Web Audio API

const isBrowser = typeof window !== 'undefined'

let audioContext: AudioContext | null = null
let soundEnabled = true

function getAudioContext(): AudioContext | null {
  if (!isBrowser) return null
  audioContext ??= new AudioContext()
  return audioContext
}

export function isSoundEnabled(): boolean {
  return soundEnabled
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.1): void {
  if (!isBrowser || !soundEnabled) return

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const oscillator = ctx.createOscillator()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime)

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(volume, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  } catch {
    // 忽略音频上下文错误
  }
}

export function playTap(): void {
  playTone(800, 0.08, 'sine', 0.08)
}

export function playButton(): void {
  playTone(600, 0.1, 'triangle', 0.1)
  setTimeout(() => playTone(900, 0.08, 'sine', 0.06), 30)
}

export function playToggle(): void {
  playTone(500, 0.06, 'sine', 0.08)
  setTimeout(() => playTone(700, 0.08, 'sine', 0.06), 40)
}

export function playTransitionUp(): void {
  playTone(400, 0.12, 'sine', 0.06)
  setTimeout(() => playTone(600, 0.1, 'sine', 0.05), 50)
  setTimeout(() => playTone(800, 0.08, 'sine', 0.04), 100)
}

export function playTransitionDown(): void {
  playTone(800, 0.08, 'sine', 0.04)
  setTimeout(() => playTone(600, 0.1, 'sine', 0.05), 50)
  setTimeout(() => playTone(400, 0.12, 'sine', 0.06), 100)
}
