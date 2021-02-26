import d from '@dominant/core';

class SetTimerBox {
  static css = {
    root: `
      SetTimerBox
      flex flex-col
      w-64
      rounded-xl
      px-6 py-4
      bg-white
      shadow-lg
    `,

    input: `
      SetTimerBox-input
      w-full
      focus:outline-none
      focus:ring ring-yellow-100
      rounded-lg
      px-4 py-2
      text-center
    `,
  };

  css = Object.create(SetTimerBox.css);

  constructor(props) {
    this.props = props;
  }

  onKeyUp = ev => {
    let text = ev.target.value.trim();

    if (ev.key === 'Escape') { return this.props.onEscape() }
    if (ev.key === 'Enter' && text) { alert(text) }
  };

  render = () => (
    <div
      model={this}
      class={this.css.root}
    >
      <input
        placeholder="Time to rise and shine?"
        class={this.css.input}
        onAttach={self => self.focus()}
        onKeyUp={this.onKeyUp}
      />
    </div>
  );
}

export default SetTimerBox;