// https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
export const forceTree = (ecosystem, element) => {
  const width = 200;
  const height = width;
  const links = ecosystem.links();
  const nodes = ecosystem.descendants();

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(0)
        .strength(1)
    )
    .force('charge', d3.forceManyBody().strength(-50))
    .force('x', d3.forceX())
    .force('y', d3.forceY());

  const svg = element
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height]);

  const link = svg
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(links)
    .join('line');

  const drag = (simulation) => {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  const tooltip = element.append('div').attr('class', 'tooltip hide');

  const mouseover = (evt, entity) => {
    const { node, name, type } = entity.data;
    const content = `<h1>${name || node} (${type})</h1>`;
    tooltip.classed('hide', false);
    tooltip.html(content);
  };
  const mouseout = (evt, node) => {
    tooltip.classed('hide', true);
    tooltip.html('');
  };
  const node = svg
    .append('g')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('class', (d) => d.data.type)
    .attr('r', 3.5)
    .call(drag(simulation))
    .on('mouseover', mouseover)
    .on('mouseout', mouseout);

  node.append('title').text(
    (d) =>
      `${d
        .ancestors()
        .map((d) => d.data.node)
        .reverse()
        .join('/')}`
  );

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
  });

  // WAT DIS? invalidation.then(() => simulation.stop());

  return svg.node();
};
