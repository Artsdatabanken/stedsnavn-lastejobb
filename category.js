let count = 1;

function add(r, l1, l2, l3) {
  if (!r[l1]) r[l1] = {};
  const x1 = r[l1];
  if (!x1[l2]) x1[l2] = {};
  const x2 = x1[l2];
  if (x2[l3]) return x2[l3];
  x2[l3] = ++count;
  return x2[l3];
}

function create() {
  const r = {
    add: (l1, l2, l3) => add(r, l1, l2, l3)
  };
  return r;
}

module.exports = { create };
