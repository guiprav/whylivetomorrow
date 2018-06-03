let inputBinding = require('./helpers/inputBinding');
let leven = require('leven');

module.exports = window.Active = {
  oninit: function() {
    app.active.toDoList = [
      { msg: `Don't be a fool` },
      { msg: `I don't know` },
    ];

    this.progress = 0;
  },

  levenUpdate: function() {
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
  },

  view: function() {
    let { toDoList } = app.active;

    let toDoListChecks = toDoList.filter(x => x.check);
    let done = toDoListChecks.length >= toDoList.length;

    return m('.panel', [
      m('.panel-heading', `Why Live Tomorrow`),

      m('.panel-block', [
        m('.has-text-info.has-text-centered', [
          toDoListChecks.length, ' / ', toDoList.length,
        ]),
      ]),

      !done && m('.panel-block', {
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
