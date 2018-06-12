let inputBinding = require('../helpers/inputBinding');
let leven = require('leven');
let moment = require('moment');

module.exports = window.Active = {
  oninit: function() {
    for (let k of ['oninterval']) {
      this[k] = this[k].bind(this);
    }

    app.active.toDoList = [
      { msg: `Don't be a fool` },
      { msg: `I don't know` },
    ];

    this.progress = 0;
    this.interval = setInterval(this.oninterval, 5000);
  },

  ondestroy: function() {
    clearInterval(this.interval);
  },

  oninterval: function() {
    if (moment().before(app.active.alarmTime)) {
      return;
    }

    this.ring();
  },

  ring: function() {
    this.isRinging = true;
    app.active.alarmTune.play();
  },

  done: function() {
    app.active.alarmTune.stop();
    this.isRinging = false;
    this.isDone = true;
  },

  levenUpdate: function() {
    let { toDoList } = app.active;

    this.progress = 0;

    for (let x of app.active.toDoList) {
      if (x.check) {
        continue;
      }

      let distance = leven(
        this.msg.toLowerCase(), x.msg.toLowerCase(),
      );

      let longerLength = this.msg.length > x.msg.length
        ? this.msg.length : x.msg.length;

      x.progress = 1 - (distance / longerLength);
      this.progress = Math.max(this.progress, x.progress);

      if (distance === 0) {
        x.check = true;

        this.msg = '';
        this.progress = 0;
      }
    }

    if (toDoList.every(x => x.check)) {
      this.done();
    }
  },

  view: function() {
    if (this.isRinging) {
      return this.ringingView();
    }

    return m('div', '...');
  },

  ringingView: function() {
    let { toDoList } = app.active;

    let toDoListChecks = toDoList.filter(x => x.check);

    return m('.panel', [
      m('.panel-heading', `Why Live Tomorrow`),

      m('.panel-block', [
        m('.has-text-info.has-text-centered', [
          toDoListChecks.length, ' / ', toDoList.length,
        ]),
      ]),

      !this.isDone && m('.panel-block', {
        style: `position: relative`,
      }, [
        m('.is-overlay', {
          style: `
            width: ${this.progress * 100}%;
            height: 2px;
            background-color: blue;
          `,
        }),

        m('input.input.has-text-centered', {
          ...inputBinding(
            this, 'msg', 'oninput',
            () => this.levenUpdate(),
          ),

          placeholder: `Where were we again?`,
        }),
      ]),

      toDoListChecks.map(x => m('.panel-block', [
        m('span.icon.has-text-success', [
          m('span.fa.fa-check-circle'),
        ]), x.msg,
      ])),
    ]);
  },
};
