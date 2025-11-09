export class SmartPolling {
  private intervalId: number | null = null;
  private isVisible: boolean = true;
  private callback: () => void;
  private activeInterval: number;
  private inactiveInterval: number;

  constructor(
    callback: () => void, 
    activeInterval: number = 30000,
    inactiveInterval: number = 120000
  ) {
    this.callback = callback;
    this.activeInterval = activeInterval;
    this.inactiveInterval = inactiveInterval;

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleVisibilityChange = () => {
    this.isVisible = !document.hidden;
    
    if (this.isVisible) {
      this.callback();
      this.restart();
    } else {
      this.restart();
    }
  };

  start() {
    this.stop();
    const interval = this.isVisible ? this.activeInterval : this.inactiveInterval;
    this.intervalId = window.setInterval(this.callback, interval);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  destroy() {
    this.stop();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}
