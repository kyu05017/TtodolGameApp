// Web mock for react-native-orientation-locker
const Orientation = {
  lockToPortrait: () => {
    console.log('[Web Mock] Orientation.lockToPortrait() called');
    
    // Use Screen Orientation API if available
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('portrait')
        .then(() => {
          console.log('[Web] Screen locked to portrait');
        })
        .catch((err) => {
          console.warn('[Web] Portrait lock failed:', err);
        });
    } else {
      console.log('[Web] Screen Orientation API not supported');
    }
  },

  lockToLandscape: () => {
    console.log('[Web Mock] Orientation.lockToLandscape() called');
    
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape')
        .then(() => {
          console.log('[Web] Screen locked to landscape');
        })
        .catch((err) => {
          console.warn('[Web] Landscape lock failed:', err);
        });
    } else {
      console.log('[Web] Screen Orientation API not supported');
    }
  },

  lockToLandscapeLeft: () => {
    console.log('[Web Mock] Orientation.lockToLandscapeLeft() called');
    
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape-primary')
        .then(() => {
          console.log('[Web] Screen locked to landscape-left');
        })
        .catch((err) => {
          console.warn('[Web] Landscape-left lock failed:', err);
        });
    }
  },

  lockToLandscapeRight: () => {
    console.log('[Web Mock] Orientation.lockToLandscapeRight() called');
    
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape-secondary')
        .then(() => {
          console.log('[Web] Screen locked to landscape-right');
        })
        .catch((err) => {
          console.warn('[Web] Landscape-right lock failed:', err);
        });
    }
  },

  unlockAllOrientations: () => {
    console.log('[Web Mock] Orientation.unlockAllOrientations() called');
    
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
      console.log('[Web] Screen orientation unlocked');
    }
  },

  getOrientation: (callback) => {
    console.log('[Web Mock] Orientation.getOrientation() called');
    
    let orientation = 'portrait';
    
    if (screen.orientation) {
      const angle = screen.orientation.angle;
      if (angle === 90 || angle === 270) {
        orientation = 'landscape';
      }
    } else if (window.orientation !== undefined) {
      const angle = window.orientation;
      if (angle === 90 || angle === -90) {
        orientation = 'landscape';
      }
    }
    
    if (callback) {
      callback(orientation);
    }
    return orientation;
  },

  addOrientationListener: (callback) => {
    console.log('[Web Mock] Orientation.addOrientationListener() called');
    
    const handleOrientationChange = () => {
      const orientation = Orientation.getOrientation();
      if (callback) {
        callback(orientation);
      }
    };

    // Listen for orientation changes
    if (screen.orientation) {
      screen.orientation.addEventListener('change', handleOrientationChange);
    } else {
      window.addEventListener('orientationchange', handleOrientationChange);
    }
  },

  removeOrientationListener: (callback) => {
    console.log('[Web Mock] Orientation.removeOrientationListener() called');
    
    // In a real implementation, you'd need to track listeners and remove them
    // For now, just log
  },

  addDeviceOrientationListener: (callback) => {
    console.log('[Web Mock] Orientation.addDeviceOrientationListener() called');
    // Mock implementation
  },

  removeDeviceOrientationListener: (callback) => {
    console.log('[Web Mock] Orientation.removeDeviceOrientationListener() called');
    // Mock implementation
  }
};

export default Orientation;