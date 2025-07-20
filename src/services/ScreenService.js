import { Platform } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation-locker';

class ScreenService {
  constructor() {
    this.isSupported = Platform.OS !== 'web';
    this.isKeepAwakeActive = false;
  }

  // Keep screen awake during gameplay
  activateKeepAwake() {
    if (!this.isSupported || this.isKeepAwakeActive) return;
    
    try {
      KeepAwake.activate();
      this.isKeepAwakeActive = true;
      console.log('✅ Screen keep awake activated');
    } catch (error) {
      console.warn('Keep awake activation failed:', error);
    }
  }

  // Deactivate screen awake
  deactivateKeepAwake() {
    if (!this.isSupported || !this.isKeepAwakeActive) return;
    
    try {
      KeepAwake.deactivate();
      this.isKeepAwakeActive = false;
      console.log('✅ Screen keep awake deactivated');
    } catch (error) {
      console.warn('Keep awake deactivation failed:', error);
    }
  }

  // Lock to portrait orientation
  lockPortrait() {
    if (!this.isSupported) return;
    
    try {
      Orientation.lockToPortrait();
      console.log('✅ Orientation locked to portrait');
    } catch (error) {
      console.warn('Portrait lock failed:', error);
    }
  }

  // Lock to landscape orientation
  lockLandscape() {
    if (!this.isSupported) return;
    
    try {
      Orientation.lockToLandscape();
      console.log('✅ Orientation locked to landscape');
    } catch (error) {
      console.warn('Landscape lock failed:', error);
    }
  }

  // Unlock orientation
  unlockOrientation() {
    if (!this.isSupported) return;
    
    try {
      Orientation.unlockAllOrientations();
      console.log('✅ Orientation unlocked');
    } catch (error) {
      console.warn('Orientation unlock failed:', error);
    }
  }

  // Get current orientation
  getCurrentOrientation() {
    if (!this.isSupported) return 'portrait';
    
    try {
      return new Promise((resolve) => {
        Orientation.getOrientation((orientation) => {
          resolve(orientation);
        });
      });
    } catch (error) {
      console.warn('Get orientation failed:', error);
      return 'portrait';
    }
  }

  // Add orientation change listener
  addOrientationListener(callback) {
    if (!this.isSupported) return () => {};
    
    try {
      Orientation.addOrientationListener(callback);
      return () => {
        Orientation.removeOrientationListener(callback);
      };
    } catch (error) {
      console.warn('Add orientation listener failed:', error);
      return () => {};
    }
  }

  // Game-specific methods
  enterGameMode() {
    this.activateKeepAwake();
    this.lockPortrait(); // Lock to portrait for better mobile gaming experience
  }

  exitGameMode() {
    this.deactivateKeepAwake();
    this.unlockOrientation();
  }

  // For tablet or landscape games
  enterLandscapeGameMode() {
    this.activateKeepAwake();
    this.lockLandscape();
  }

  // Status check
  getStatus() {
    return {
      isKeepAwakeActive: this.isKeepAwakeActive,
      isSupported: this.isSupported,
    };
  }
}

// Create singleton instance
const screenService = new ScreenService();

export default screenService;
export { ScreenService };