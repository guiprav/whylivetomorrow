import d from '@dominant/core';
import leven from 'leven';
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
      px-4 py-2
      text-gray-500 hover:text-gray-800 focus:text-gray-800
      bg-transparent hover:bg-white focus:bg-white
      opacity-75 hover:opacity-100 focus:opacity-100
    `,

    setAlarmBtn: `
      flex-shrink-0
      self-center
      focus:outline-none
      ml-4 px-5 py-2
      rounded-lg
      font-bold
      bg-yellow-300 disabled:bg-gray-300
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

  get activeReasons() {
    return this.props.mode === 'setup'
      ? this.props.reasons
      : this.props.enteredReasons;
  }

  onKeyUp = ev => {
    let text = ev.target.value.trim();

    if (ev.key !== 'Enter' || !text) { return }

    if (this.props.mode === 'engaged') {
      let [similarity, mostSimilar] = this.mostSimilar;

      text = similarity > 0 && mostSimilar?.text;
      if (!text) { return }
    }

    this.activeReasons.push({ text });
    this.inputText = '';
  };

  get done() {
    return this.props.enteredReasons.length >= this.props.reasons.length;
  }

  get mostSimilar() {
    let inputText = this.inputText.trim(), lowestDist, mostSimilar;

    for (let x of this.props.reasons) {
      if (this.props.enteredReasons.some(y => y.text === x.text)) { continue }

      let dist = leven(this.inputText.toLowerCase(), x.text.toLowerCase());

      if (lowestDist === undefined || dist < lowestDist) {
        lowestDist = dist;
        mostSimilar = x;
      }
    }

    if (lowestDist === undefined) { return [0] }

    return [
      ((1 - (lowestDist / mostSimilar.text.length)) * 100).toFixed(0),
      mostSimilar,
    ];
  }

  render = () => (
    <div
      model={this}
      class={this.css.root}
      style={{ width: () => !this.activeReasons.length ? '26rem' : '32rem' }}
      onAttach={() => this.inputText = ''}
    >
      <div class={['flex', !!this.activeReasons.length && 'mb-1']}>
        <input
          placeholder="Why Live Tomorrow?"
          value={this.inputText}

          class={[
            this.css.input,
            !!this.activeReasons.length && tw`focus:border-yellow-400`,
          ]}

          onAttach={input => input.focus()}
          onFocus={ev => ev.target.select()}
          onKeyUp={this.onKeyUp}
        />

        {d.if(this.props.mode === 'setup' && this.activeReasons.length, (
          <button
            class={this.css.setAlarmBtn}
            onClick={this.props.onSetAlarmClick}
            children="It's bed time"
          />
        ))}

        {d.if(this.props.mode === 'engaged' && (
          this.inputText.length || this.activeReasons.length
        ), (
          <button
            class={this.css.setAlarmBtn}
            disabled={this.inputText.trim() || !this.done}
            onClick={this.props.onDisarmClick}

            textContent={
              this.inputText.trim() ? `${this.mostSimilar?.[0]}%` : (
                !this.done ? [
                  this.props.enteredReasons.length,
                  this.props.reasons.length,
                ].join('/') : "I am awake!"
              )
            }
          />
        ))}
      </div>

      <div class={this.css.reasons}>
        {d.map(this.activeReasons, (x, i) => (
          <div class={this.css.reason}>
            {x.text}
            <button
              class={tw`invisible group-hover:visible`}
              onClick={() => this.activeReasons.splice(i, 1)}
              children="╳"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReasonsBox;