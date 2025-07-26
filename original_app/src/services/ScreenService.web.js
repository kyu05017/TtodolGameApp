// Web version of ScreenService
class ScreenService {
  constructor() {
    this.isSupported = true; // Web supports screen management
    this.isKeepAwakeActive = false;
    this.wakeLock = null;
    console.log('🖥️ ScreenService Web 초기화')
  }

  // Keep screen awake during gameplay using Screen Wake Lock API
  async activateKeepAwake() {
    if (this.isKeepAwakeActive) return;
    
    try {
      if ('wakeLock' in navigator) {
        this.wakeLock = await navigator.wakeLock.request('screen')
        this.isKeepAwakeActive = true;
        console.log('✅ Web screen wake lock activated')
        
        // Handle wake lock release events
        this.wakeLock.addEventListener('release', () => {
          console.log('🛏️ Wake lock was released')
          this.isKeepAwakeActive = false;
        })
      } else {
        console.warn('Wake Lock API not supported in this browser')
      }
    } catch (error) {
      console.warn('Web keep awake activation failed:', error)
    }
  }

  // Deactivate screen awake
  async deactivateKeepAwake() {
    if (!this.isKeepAwakeActive || !this.wakeLock) return;
    
    try {
      await this.wakeLock.release()
      this.wakeLock = null;
      this.isKeepAwakeActive = false;
      console.log('✅ Web screen wake lock deactivated')
    } catch (error) {
      console.warn('Web keep awake deactivation failed:', error)
    }
  }

  // Lock to portrait orientation (web)
  lockPortrait() {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait-primary').catch(error => {
          console.warn('Web portrait lock failed:', error)
        })
        console.log('✅ Web orientation locked to portrait')
      } else {
        console.warn('Screen orientation lock not supported in this browser')
      }
    } catch (error) {
      console.warn('Web portrait lock failed:', error)
    }
  }

  // Lock to landscape orientation (web)
  lockLandscape() {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape-primary').catch(error => {
          console.warn('Web landscape lock failed:', error)
        })
        console.log('✅ Web orientation locked to landscape')
      } else {
        console.warn('Screen orientation lock not supported in this browser')
      }
    } catch (error) {
      console.warn('Web landscape lock failed:', error)
    }
  }

  // Unlock orientation (web)
  unlockOrientation() {
    try {
      if (screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock()
        console.log('✅ Web orientation unlocked')
      } else {
        console.warn('Screen orientation unlock not supported in this browser')
      }
    } catch (error) {
      console.warn('Web orientation unlock failed:', error)
    }
  }

  // Get current orientation (web)
  getCurrentOrientation() {
    try {
      if (screen.orientation) {
        return Promise.resolve(screen.orientation.type)
      } else {
        // Fallback based on window dimensions
        const orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        return Promise.resolve(orientation)
      }
    } catch (error) {
      console.warn('Web get orientation failed:', error)
      return Promise.resolve('portrait')
    }
  }

  // Add orientation change listener (web)
  addOrientationListener(callback) {
    try {
      const handleOrientationChange = () => {
        this.getCurrentOrientation().then(callback)
      };

      if (screen.orientation) {
        screen.orientation.addEventListener('change', handleOrientationChange)
        return () => {
          screen.orientation.removeEventListener('change', handleOrientationChange)
        };
      } else {
        // Fallback to window resize
        window.addEventListener('resize', handleOrientationChange)
        return () => {
          window.removeEventListener('resize', handleOrientationChange)
        };
      }
    } catch (error) {
      console.warn('Web add orientation listener failed:', error)
      return () => {};
    }
  }

  // Game-specific methods
  enterGameMode() {
    this.activateKeepAwake()
    this.lockPortrait() // Lock to portrait for better mobile gaming experience
    
    // Add CSS class to body for game-specific styles
    if (document.body) {
      document.body.classList.add('game-mode')
    }
  }

  exitGameMode() {
    this.deactivateKeepAwake()
    this.unlockOrientation()
    
    // Remove CSS class from body
    if (document.body) {
      document.body.classList.remove('game-mode')
    }
  }

  // For tablet or landscape games
  enterLandscapeGameMode() {
    this.activateKeepAwake()
    this.lockLandscape()
    
    // Add CSS class to body for game-specific styles
    if (document.body) {
      document.body.classList.add('game-mode')
    }
  }

  // Status check
  getStatus() {
    return {
      isKeepAwakeActive: this.isKeepAwakeActive,
      isSupported: this.isSupported,
      wakeLockSupported: 'wakeLock' in navigator,
      orientationSupported: 'orientation' in screen,
    };
  }
}

// Create singleton instance
const screenService = new ScreenService()

export default screenService;



