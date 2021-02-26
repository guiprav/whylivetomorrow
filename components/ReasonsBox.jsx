import d from '@dominant/core';

class ReasonsBox {
  static css = {
    root: `
      ReasonsBox
      flex flex-col
      rounded-xl
      px-6 py-4
      bg-white
      shadow-lg
    `,

    input: `
      ReasonsBox-input
      w-full
      focus:outline-none
      focus:ring ring-yellow-100
      rounded-lg
      px-4 py-2
    `,

    reasons: `
      ReasonsBox-reasons
      flex flex-col
      divide-y divide-gray-100
    `,

    reason: `
      ReasonsBox-reason
      p-4
    `,

    setAlarmBtn: `
      ReasonsBox-setAlarmBtn
      flex-shrink-0
      self-center
      focus:outline-none
      ml-4 px-5 py-2
      rounded-lg
      font-bold
      bg-yellow-300
      text-gray-900
    `,
  };

  css = Object.create(ReasonsBox.css);

  constructor(props) {
    props.reasons = props.reasons || [{ text: 'Hello' }];
    this.props = props;
  }

  get reasons() { return this.props.reasons }

  onKeyUp = ev => {
    let text = ev.target.value.trim();
    if (ev.key !== 'Enter' || !text) { return }

    this.reasons.push({ text });
    ev.target.value = '';
  };

  render = () => (
    <div
      model={this}
      class={this.css.root}
      style={{ width: () => !this.reasons.length ? '26rem' : '32rem' }}
    >
      <div class={['flex', !!this.reasons.length && 'mb-1']}>
        <input
          placeholder="Why Live Tomorrow?"
          class={this.css.input}
          onAttach={input => input.focus()}
          onKeyUp={this.onKeyUp}
        />

        {d.if(this.reasons.length, (
          <button
            class={this.css.setAlarmBtn}
            onClick={this.props.onSetAlarmClick}
            children="Bed Time!"
          />
        ))}
      </div>

      <div class="">
        {d.map(this.reasons, x => (
          <div class={this.css.reason}>
            {x.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReasonsBox;