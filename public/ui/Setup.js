let inputBinding = require('../helpers/inputBinding');

module.exports = window.Setup = {
  oninit: function() {
    window.setup = this;
    this.tab = 'alarm';
    this.alarmTimeInputVal = '';
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
          disabled: !this.isAlarmTimeValid,
          onclick: () => app.alarmClock.activate(this.alarmTime),
        }, 'Activate'),
      ]),
    ]);
  },

  selectTab: function(tab) {
    this.tab = tab;
  },

  tabs: {
    'alarm': function() {
      return m('.panel-block', [
        m('input.input.has-text-centered', {
          ...inputBinding(
            this, 'alarmTimeInputVal', 'onkeyup',
          ),

          placeholder: '00:00',
        }),
      ]);
    },

    'to-do': function() {
      return m('.panel-block', 'To-Do');
    },
  },

  get isAlarmTimeValid() {
    return this.alarmTime.isValid() &&
      /^\d\d:\d\d$/.test(this.alarmTimeInputVal);
  },

  get alarmTime() {
    let m = moment(this.alarmTimeInputVal, 'HH:mm');

    if (moment().isAfter(m)) {
      m.add(1, 'day');
    }

    return m;
  },
};
