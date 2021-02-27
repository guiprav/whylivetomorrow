import { tw } from 'twind';

function bem(block, els) {
  let ret = {};

  for (let [k, v] of Object.entries(els)) {
    ret[k] = [block, k !== 'root' && k].filter(Boolean).join('-') + ' ' + tw(v);
  }

  return ret;
}

let obs = new MutationObserver(muts => {
  obs.disconnect();

  for (let mut of muts) {
    let name = mut.attributeName;
    if (name !== 'class') { continue }

    let value = mut.target.getAttribute(name);
    if (!/^[A-Z]/.test(value.trim())) { continue }

    let [bemId, ...xs] = value.split(' ');

    for (let el of document.querySelectorAll(`.${bemId}`)) {
      tw(xs.join(' '));
      el.className = value;
    }
  }

  obs.observe(document.body, { attributes: true, attributeOldValue: true, subtree: true });
});

requestAnimationFrame(() => obs.observe(document.body, {
  attributes: true,
  subtree: true,
}));

export { bem, tw };