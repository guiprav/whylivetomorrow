import ReasonsBox from './ReasonsBox.jsx';
import SetTimerBox from './SetTimerBox.jsx';
import d from '@dominant/core';
import dayjs from 'dayjs';
import { bem, tw } from '../css.js';

class App {
  static css = bem('App', {
    root: `
      flex items-center justify-center
      h-screen
      p-3
      bg-gradient-to-b
      from-gray-900
      to-gray-800
    `,

    bgVideo: `
      fixed left-0 top-0 right-0 bottom-0
      hidden
      w-full h-full
      object-cover
      opacity-75
    `,
  });

  css = Object.create(App.css);

  screen = 'setReasons';
  reasons = [];
  alarmTimeText = '';

  get persistentState() {
    return {
      screen: this.screen,
      reasons: this.reasons,
      alarmTimeText: this.alarmTimeText,
    };
  }

  get active() { return this.screen === 'active' }

  render = () => (
    <div
      model={this}
      class={this.css.root}
      onAttach={this.onAttach}
      onDetach={this.onDetach}
      onClick={() => this.active && (this.screen = 'setReasons')}
    >
      <video
        autoplay
        muted
        loop
        class={[this.css.bgVideo, this.active && tw`block!`]}
        children={<source type="video/mp4" src="bgActive.mp4" />}
      />

      {this.audioEl = <audio loop src="alarm.mp3" />}

      {d.if(this.screen === 'setReasons', (
        <ReasonsBox
          reasons={this.reasons}
          onSetAlarmClick={() => this.screen = 'setTimer'}
        />
      ))}

      {d.if(this.screen === 'setTimer', (
        <SetTimerBox
          alarmTimeText={this.alarmTimeText}

          onEscape={() => {
            this.screen = 'setReasons';
            this.alarmTime = '';
          }}

          onActivate={() => {
            if (!this.alarmTime) { return }
            this.screen = 'active';
          }}
        />
      ))}
    </div>
  );

  onAttach = () => {
    Object.assign(this,
      JSON.parse(localStorage.getItem('persistentState') || '{}'));

    d.on('beforeUpdate', this.beforeUpdate);
    d.on('update', this.onUpdate);

    this.intervalId = setInterval(this.onInterval, 5000);
  };

  onDetach = () => {
    d.off('beforeUpdate', this.beforeUpdate);
    d.off('update', this.onUpdate);

    clearInterval(this.intervalId);
  };

  beforeUpdate = () => {
    if (!this.active) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }

    if (this.alarmTimeText !== this.lastAlarmTimeText) {
      this.lastAlarmTimeText = this.alarmTimeText;

      if (!/^\d\d:\d\d$/.test(this.alarmTimeText)) {
        this.alarmTime = null;
        return;
      }

      this.alarmTime = dayjs(
        `${dayjs().format('YYYY-MM-DD')} ${this.alarmTimeText}`);

      if (this.alarmTime.isBefore(dayjs())) {
        this.alarmTime = this.alarmTime.add(1, 'day');
      }
    }
  };

  onUpdate = () => {
    let persistentStateJson = JSON.stringify(this.persistentState);

    if (persistentStateJson !== this.lastPersistentStateJson) {
      localStorage.setItem('persistentState', persistentStateJson);
    }
  };

  onInterval = () => {
    if (!this.active || !this.alarmTime || dayjs().isBefore(this.alarmTime)) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
      return;
    }

    this.audioEl.play();
  };
}

export default App;