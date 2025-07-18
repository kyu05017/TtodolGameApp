// Mock for react-native-sound
export default class Sound {
  constructor(filename, basePath, callback) {
    this.filename = filename;
    this.basePath = basePath;
    this.isLoaded = true;
    this.isPlaying = false;
    this.duration = 0;
    this.currentTime = 0;
    this.volume = 1;
    this.loops = 0;
    
    if (callback) {
      setTimeout(() => callback(null, this), 100);
    }
  }

  static setCategory(category) {
    // Mock implementation
  }

  static setMode(mode) {
    // Mock implementation
  }

  static setActive(active) {
    // Mock implementation
  }

  static MAIN_BUNDLE = '';
  static DOCUMENT = '';
  static LIBRARY = '';
  static CACHES = '';

  play(callback) {
    this.isPlaying = true;
    if (callback) {
      callback(true);
    }
  }

  pause() {
    this.isPlaying = false;
  }

  stop() {
    this.isPlaying = false;
    this.currentTime = 0;
  }

  release() {
    this.isLoaded = false;
    this.isPlaying = false;
  }

  setVolume(volume) {
    this.volume = volume;
  }

  setSpeed(speed) {
    // Mock implementation
  }

  setNumberOfLoops(loops) {
    this.loops = loops;
  }

  getCurrentTime(callback) {
    if (callback) {
      callback(this.currentTime);
    }
  }

  getDuration() {
    return this.duration;
  }

  isLoaded() {
    return this.isLoaded;
  }

  isPlaying() {
    return this.isPlaying;
  }
}