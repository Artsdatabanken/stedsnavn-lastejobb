function add(r, category) {
  if (r[category]) return r[category];
  r[category] = ++r.count;
  return r[category];
}

function create() {
  const r = {
    add: category => add(r, category),
    count: 0
  };
  return r;
}

module.exports = { create };
