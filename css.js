import { tw } from 'twind';

function bem(block, els) {
  let ret = {};

  for (let [k, v] of Object.entries(els)) {
    ret[k] = [block, k !== 'root' && k].filter(Boolean).join('-') + ' ' + tw(v);
  }

  return ret;
}

let obs = new MutationObserver(muts => {
  for (let mut of muts) {
    let name = mut.attributeName;
    if (name !== 'class') { continue }

    tw(mut.target.getAttribute(name)
      .split(' ').filter(x => !/[A-Z]/.test(x)).join(' '));
  }
});

requestAnimationFrame(() => obs.observe(document.body, {
  attributes: true,
  subtree: true,
}));

export { bem, tw };