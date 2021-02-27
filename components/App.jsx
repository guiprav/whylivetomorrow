import ReasonsBox from './ReasonsBox.jsx';
import SetTimerBox from './SetTimerBox.jsx';
import d from '@dominant/core';
import { tw } from 'twind';

class App {
  static css = {
    root: tw`
      App
      flex items-center justify-center
      h-screen
      p-3
      bg-gradient-to-b
      from-yellow-300
      to-yellow-400
    `,
  };

  css = Object.create(App.css);

  screen = 'setReasons';

  render = () => (
    <div model={this} class={this.css.root}>
      {d.if(this.screen === 'setReasons', (
        <ReasonsBox onSetAlarmClick={() => this.screen = 'setTimer'} />
      ))}

      {d.if(this.screen === 'setTimer', (
        <SetTimerBox onEscape={() => this.screen = 'setReasons'} />
      ))}
    </div>
  );
}

export default App;