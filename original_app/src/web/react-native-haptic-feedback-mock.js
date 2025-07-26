// Web mock for react-native-haptic-feedback
const ReactNativeHapticFeedback = {
  trigger: (type, options) => {
    console.log(`[Web Mock] Haptic feedback triggered: ${type}`, options)
    
    // Web Vibration API fallback if available
    if (navigator.vibrate) {
      switch (type) {
        case 'impactLight':
          navigator.vibrate(50)
          break;
        case 'impactMedium':
          navigator.vibrate(100)
          break;
        case 'impactHeavy':
          navigator.vibrate(200)
          break;
        case 'notificationSuccess':
          navigator.vibrate([50, 50, 100, 50, 50])
          break;
        case 'notificationWarning':
          navigator.vibrate([100, 100, 100])
          break;
        case 'notificationError':
          navigator.vibrate(300)
          break;
        default:
          navigator.vibrate(100)
      }
    }
  },
  
  // Additional methods that might be used
  selection: () => {
    console.log('[Web Mock] Selection haptic feedback')
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  },
  
  impactLight: () => {
    console.log('[Web Mock] Impact light haptic feedback')
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  },
  
  impactMedium: () => {
    console.log('[Web Mock] Impact medium haptic feedback')
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }
  },
  
  impactHeavy: () => {
    console.log('[Web Mock] Impact heavy haptic feedback')
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }
  },
  
  notificationSuccess: () => {
    console.log('[Web Mock] Notification success haptic feedback')
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 100, 50, 50])
    }
  },
  
  notificationWarning: () => {
    console.log('[Web Mock] Notification warning haptic feedback')
    if (navigator.vibrate) {
      navigator.vibrate([100, 100, 100])
    }
  },
  
  notificationError: () => {
    console.log('[Web Mock] Notification error haptic feedback')
    if (navigator.vibrate) {
      navigator.vibrate(300)
    }
  }
};

export default ReactNativeHapticFeedback;