import d from '@dominant/core';
import { bem } from '../css.js';

class SetTimerBox {
  static css = bem('SetTimerBox', {
    root: `
      flex flex-col
      w-64
      rounded-xl
      px-6 py-4
      bg-white
      shadow-lg
    `,

    input: `
      w-full
      focus:outline-none
      rounded-lg
      px-4 py-2
      text-center
    `,
  });

  css = Object.create(SetTimerBox.css);

  constructor(props) {
    this.props = props;
  }

  onKeyUp = ev => {
    let text = ev.target.value.trim();

    if (ev.key === 'Escape') { return this.props.onEscape() }
    if (ev.key === 'Enter' && text) { return this.props.onActivate() }
  };

  render = () => (
    <div
      model={this}
      class={this.css.root}
    >
      <input
        class={this.css.input}
        placeholder="Time to rise and shine?"
        value={this.props.alarmTimeText}
        onAttach={input => input.select()}
        onFocus={ev => ev.target.select()}
        onKeyUp={this.onKeyUp}
      />
    </div>
  );
}

export default SetTimerBox;