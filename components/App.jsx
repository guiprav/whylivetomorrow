import ReasonsBox from './ReasonsBox.jsx';
import SetTimerBox from './SetTimerBox.jsx';
import d from '@dominant/core';
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
  alarmTime = '';

  get active() { return this.screen === 'active' }

  get persistentState() {
    return {
      screen: this.screen,
      reasons: this.reasons,
      alarmTime: this.alarmTime,
    };
  }

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

      {d.if(this.screen === 'setReasons', (
        <ReasonsBox
          reasons={this.reasons}
          onSetAlarmClick={() => this.screen = 'setTimer'}
        />
      ))}

      {d.if(this.screen === 'setTimer', (
        <SetTimerBox
          alarmTime={this.alarmTime}

          onEscape={() => {
            this.screen = 'setReasons';
            this.alarmTime = '';
          }}

          onActivate={() => this.screen = 'active'}
        />
      ))}
    </div>
  );

  onAttach = () => {
    Object.assign(this,
      JSON.parse(localStorage.getItem('persistentState') || '{}'));

    d.on('update', this.onUpdate);
  };

  onDetach = () => { d.off('update', this.onUpdate) };

  onUpdate = () => {
    let persistentStateJson = JSON.stringify(this.persistentState);

    if (persistentStateJson !== this.lastPersistentStateJson) {
      localStorage.setItem('persistentState', persistentStateJson);
    }
  };
}

export default App;