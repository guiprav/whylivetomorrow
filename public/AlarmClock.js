module.exports = window.AlarmClock = class AlarmClock {
  constructor() {
    this.alarmUrl = '/alarm.mp3';
    this.alarmTime = null;
    this.snoozeTime = null;
  }

  set alarmUrl(val) {
    let { audio } = this;

    if (audio) {
      audio.pause();
      audio.remove();
    }

    audio = this.audio = new Audio(val);
  }

  get alarmUrl() {
    return this.audio && this.audio.src;
  }

  get isActive() {
    return !!this.interval;
  }

  activate() {
    if (this.interval) {
      throw new Error(`Already active`);
    }

    if (!this.alarmTime) {
      throw new Error(`Missing alarm time`);
    }

    this.interval = setInterval(
      () => this.onInterval(), 5000,
    );
  }

  deactivate() {
    this.snoozeTime = null;

    clearInterval(this.interval);
    this.interval = null;
  }

  onInterval() {
    if (
      !this.isSnoozing
      && this.alarmTime.isAfter(moment())
    ) {
      this.ring();
      return;
    }

    if (
      this.isSnoozing
      && this.snoozeTime.isAfter(moment())
    ) {
      this.ring();
      return;
    }
  }

  get isRinging() {
    return this.audio && !this.audio.paused;
  }

  ring() {
    if (!this.audio) {
      throw new Error(`Missing alarmUrl`);
    }

    if (this.isRinging) {
      return;
    }

    this.audio.play().then(() => this.ring());
  }

  get isSnoozing() {
    return !!this.snoozeTime;
  }

  snooze(minutes) {
    if (!this.isRinging) {
      throw new Error(`Can't snooze if not ringing`);
    }

    if (!this.snoozeTime) {
      this.snoozeTime = this.alarmTime.clone();
    }

    this.snoozeTime.add(minutes, 'minutes');
  }
};
