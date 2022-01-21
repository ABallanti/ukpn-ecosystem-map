export const nodePath = (d, target = undefined, attr = 'id', separator = '/') => {
  let list = d.descendants();
  if (target) {
    list = d.path(target).slice(0, -1);
  }
  return list
    .map((d) => d.data[attr])
    .reverse()
    .join(separator);
};
