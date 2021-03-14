import d from '@dominant/core';
import { bem, tw } from '../css.js';

class ReasonsBox {
  static css = bem('ReasonsBox', {
    root: `
      flex flex-col
      rounded-xl
      px-6 py-4
      bg-gray-100
      shadow-lg
    `,

    input: `
      w-full
      focus:outline-none
      border-b border-transparent
      rounded-lg
      px-4 py-2
      text-gray-500 hover:text-gray-800 focus:text-gray-800
      bg-transparent focus:bg-white
      opacity-75 hover:opacity-100 focus:opacity-100
    `,

    setAlarmBtn: `
      flex-shrink-0
      self-center
      focus:outline-none
      ml-4 px-5 py-2
      rounded-lg
      font-bold
      bg-yellow-300
      text-white
    `,

    reasons: `
      flex flex-col
      divide-y divide-gray-100
    `,

    reason: `
      group
      flex justify-between
      p-4
      text-gray-600
    `,
  });

  css = Object.create(ReasonsBox.css);

  constructor(props) {
    props.reasons = props.reasons || [];
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
          class={[this.css.input, !!this.reasons.length && 'focus:border-yellow-400']}
          onAttach={input => input.focus()}
          onFocus={ev => ev.target.select()}
          onKeyUp={this.onKeyUp}
        />

        {d.if(this.reasons.length, (
          <button
            class={this.css.setAlarmBtn}
            onClick={this.props.onSetAlarmClick}
            children="It's bed time"
          />
        ))}
      </div>

      <div class={this.css.reasons}>
        {d.map(this.reasons, (x, i) => (
          <div class={this.css.reason}>
            {x.text}
            <button
              class={tw`invisible group-hover:visible`}
              onClick={() => this.reasons.splice(i, 1)}
              children="╳"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReasonsBox;