// Web mock for react-native-keep-awake
import { Component } from 'react';

let wakeLockSentinel = null;

class KeepAwake extends Component {
  static activate() {
    console.log('[Web Mock] KeepAwake.activate() called')
    
    // Use Wake Lock API if available
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen')
        .then((wakeLock) => {
          wakeLockSentinel = wakeLock;
          console.log('[Web] Screen wake lock activated')
        })
        .catch((err) => {
          console.warn('[Web] Wake lock request failed:', err)
        })
    } else {
      console.log('[Web] Wake Lock API not supported')
    }
  }

  static deactivate() {
    console.log('[Web Mock] KeepAwake.deactivate() called')
    
    if (wakeLockSentinel) {
      wakeLockSentinel.release()
        .then(() => {
          wakeLockSentinel = null;
          console.log('[Web] Screen wake lock released')
        })
        .catch((err) => {
          console.warn('[Web] Wake lock release failed:', err)
        })
    }
  }

  componentDidMount() {
    KeepAwake.activate()
  }

  componentWillUnmount() {
    KeepAwake.deactivate()
  }

  render() {
    return null;
  }
}

export default KeepAwake;