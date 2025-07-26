// Web version of HapticService
class HapticService {
  constructor() {
    this.isSupported = 'vibrate' in navigator;
    console.log('🎮 HapticService Web 초기화 - vibration 지원:', this.isSupported)
  }

  // Light haptic feedback for button taps
  light() {
    if (!this.isSupported) return;
    
    try {
      navigator.vibrate(50)
    } catch (error) {
      console.warn('Web vibration failed:', error)
    }
  }

  // Medium haptic feedback for successful actions
  medium() {
    if (!this.isSupported) return;
    
    try {
      navigator.vibrate(100)
    } catch (error) {
      console.warn('Web vibration failed:', error)
    }
  }

  // Heavy haptic feedback for important events
  heavy() {
    if (!this.isSupported) return;
    
    try {
      navigator.vibrate(200)
    } catch (error) {
      console.warn('Web vibration failed:', error)
    }
  }

  // Success haptic feedback
  success() {
    if (!this.isSupported) return;
    
    try {
      navigator.vibrate([50, 50, 100, 50, 50])
    } catch (error) {
      console.warn('Web vibration failed:', error)
    }
  }

  // Warning haptic feedback
  warning() {
    if (!this.isSupported) return;
    
    try {
      navigator.vibrate([100, 100, 100])
    } catch (error) {
      console.warn('Web vibration failed:', error)
    }
  }

  // Error haptic feedback
  error() {
    if (!this.isSupported) return;
    
    try {
      navigator.vibrate(300)
    } catch (error) {
      console.warn('Web vibration failed:', error)
    }
  }

  // Cancel any ongoing vibration
  cancel() {
    try {
      navigator.vibrate(0)
    } catch (error) {
      console.warn('Web vibration cancel failed:', error)
    }
  }

  // Game-specific haptic patterns
  fruitDrop() {
    this.light()
  }

  fruitMerge(fruitType) {
    // Stronger feedback for bigger fruits
    if (fruitType >= 8) {
      this.heavy()
    } else if (fruitType >= 5) {
      this.medium()
    } else {
      this.light()
    }
  }

  gameOver() {
    this.error()
  }

  highScore() {
    this.success()
  }

  buttonPress() {
    this.light()
  }

  menuOpen() {
    this.light()
  }
}

// Create singleton instance
const hapticService = new HapticService()

export default hapticService;



