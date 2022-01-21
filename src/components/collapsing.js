export function collapseOrExpandChildren (d, links, callback) {
  if (!d.children) return;

  // if (!d3.event.defaultPrevented) {
  const inc = d.collapsed ? -1 : 1;
  recurse(d);

  function recurse (sourceNode) {
    // check if link is from this node, and if so, collapse
    links.forEach(function (l) {
      if (l.source.id === sourceNode.id) {
        l.target.collapsing += inc;
        recurse(l.target);
      }
    });
  }
  d.collapsed = !d.collapsed;
  // }
  callback();
}
