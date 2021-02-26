module.exports = window.AlarmClock = class AlarmClock {
  constructor() {
    this.alarmUrl = '/alarm.mp3';
    this.alarmTime = null;
    this.snoozeTime = null;
  }

  debug(...args) {
    console.log(`DEBUG [AlarmClock]`, ...args);
  }

  set alarmUrl(val) {
    let { audio } = this;

    if (audio) {
      this.debug(`audio pause / remove`);
      audio.pause();
      audio.remove();
    }

    this.debug(`new Audio(${val})`);
    audio = this.audio = new Audio(val);
  }

  get alarmUrl() {
    return this.audio && this.audio.src;
  }

  get isActive() {
    return !!this.interval;
  }

  activate(alarmTime) {
    if (this.interval) {
      throw new Error(`Already active`);
    }

    this.alarmTime = alarmTime;

    if (!this.alarmTime) {
      throw new Error(`Missing alarm time`);
    }

    this.debug(`setInterval`);
    this.interval = setInterval(
      () => this.onInterval(), 5000,
    );
  }

  deactivate() {
    this.debug(`snoozeTime = null`);
    this.snoozeTime = null;

    this.debug(`clearInterval`);
    clearInterval(this.interval);
    this.interval = null;
  }

  onInterval() {
    if (
      !this.isSnoozing
      && moment().isAfter(this.alarmTime)
    ) {
      this.debug(`!isSnoozing && now isAfter alarmTime`);
      this.ring();
      return;
    }

    if (
      this.isSnoozing
      && moment().isAfter(this.snoozeTime)
    ) {
      this.debug(`isSnoozing && now isAfter snoozeTime`);
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

    this.debug(`audio play`);
    this.audio.play().then(() => {
      this.debug(`ring again`);
      this.ring();
    });
  }

  get isSnoozing() {
    return !!this.snoozeTime;
  }

  snooze(minutes) {
    if (!this.isRinging) {
      throw new Error(`Can't snooze if not ringing`);
    }

    this.debug(`snoozeTime = now +`, minutes, `minutes`);
    this.snoozeTime = moment().add(minutes, 'minutes');
  }
};
