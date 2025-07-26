import { Platform, Vibration } from 'react-native';

class HapticService {
  constructor() {
    this.isSupported = Platform.OS !== 'web';
  }

  // Light haptic feedback for button taps
  light() {
    if (!this.isSupported) return;
    
    try {
      Vibration.vibrate(50)
    } catch (error) {
      console.warn('Vibration failed:', error)
    }
  }

  // Medium haptic feedback for successful actions
  medium() {
    if (!this.isSupported) return;
    
    try {
      Vibration.vibrate(100)
    } catch (error) {
      console.warn('Vibration failed:', error)
    }
  }

  // Heavy haptic feedback for important events
  heavy() {
    if (!this.isSupported) return;
    
    try {
      Vibration.vibrate(200)
    } catch (error) {
      console.warn('Vibration failed:', error)
    }
  }

  // Success haptic feedback
  success() {
    if (!this.isSupported) return;
    
    try {
      Vibration.vibrate([0, 50, 50, 100, 50, 50])
    } catch (error) {
      console.warn('Vibration failed:', error)
    }
  }

  // Warning haptic feedback
  warning() {
    if (!this.isSupported) return;
    
    try {
      Vibration.vibrate([0, 100, 100, 100])
    } catch (error) {
      console.warn('Vibration failed:', error)
    }
  }

  // Error haptic feedback
  error() {
    if (!this.isSupported) return;
    
    try {
      Vibration.vibrate(300)
    } catch (error) {
      console.warn('Vibration failed:', error)
    }
  }

  // Cancel any ongoing vibration
  cancel() {
    try {
      Vibration.cancel()
    } catch (error) {
      console.warn('Haptic cancel failed:', error)
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



