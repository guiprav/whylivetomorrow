window.m = require('mithril');
window.moment = require('moment');

require('./ui/App');

m.mount(document.body, App);
