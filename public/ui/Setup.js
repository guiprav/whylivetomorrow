let inputBinding = require('../helpers/inputBinding');

module.exports = window.Setup = {
  oninit: function() {
    this.tab = 'alarm';
  },

  view: function() {
    return m('.panel', [
      m('.panel-heading', `Why Live Tomorrow`),

      m('.panel-tabs', [
        ['alarm', 'to-do'].map(
          x => m('a', {
            class: this.tab === x && 'is-active',
            onclick: () => this.selectTab(x),
          }, x),
        ),
      ]),

      this.tabs[this.tab].call(this),

      m('.panel-block', [
        m('button.button.is-danger.is-fullwidth', {
          onclick: () => this.activate(),
        }, 'Activate'),
      ]),
    ]);
  },

  selectTab: function(tab) {
    this.tab = tab;
  },

  activate: function() {
    app.active = {};
  },

  tabs: {
    'alarm': function() {
      return m('.panel-block', [
        m('input.input.has-text-centered', {
          ...inputBinding(this, 'alarmTime'),
          placeholder: '00:00',
        }),
      ]);
    },

    'to-do': function() {
      return m('.panel-block', 'To-Do');
    },
  },
};
