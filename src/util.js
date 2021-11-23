export const sid = (() => {
  const sequences = {};
  function* sequence(ref) {
    let i = 0;
    while (true) {
      yield `${ref}-${i}`;
      i++;
    }
  }
  return (id) => {
    if (!sequences[id]) sequences[id] = sequence(id);
    return sequences[id].next().value;
  }
})();

export function autoBox() {
  const { x, y, width, height } = this.getBBox();
  return [x, y, width, height];
}

