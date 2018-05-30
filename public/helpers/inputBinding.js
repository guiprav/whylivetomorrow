module.exports = (ctx, propName, evName, cb) => ({
  value: ctx[propName],

  [evName || 'onchange']: ev => {
    ctx[propName] = ev.target.value;
    cb(ctx[propName]);
  },
});
