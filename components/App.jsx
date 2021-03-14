import ReasonsBox from './ReasonsBox.jsx';
import SetTimerBox from './SetTimerBox.jsx';
import d from '@dominant/core';
import { bem } from '../css.js';

class App {
  static css = bem('App', {
    root: `
      flex items-center justify-center
      h-screen
      p-3
      bg-gradient-to-b
      from-yellow-300
      to-yellow-400
    `,
  });

  css = Object.create(App.css);

  screen = 'setReasons';
  reasons = [];
  alarmTime = '';

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
    >
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