require('bulma/css/bulma.css');
require('./App.css');

require('./Active');
require('./Setup');

module.exports = window.App = {
  oninit: function() {
    window.app = this;

    // FIXME: Use some sort of helper to implement these.
    Object.defineProperty(this, 'inner', {
      get: () => this.vnInner && this.vnInner.state,
    });
  },

  view: function() {
    if (this.active) {
      this.vnInner = m(Active);
    }
    else {
      this.vnInner = m(Setup);
    }

    return m('.App', this.vnInner);
  },
};
