import * as d3 from './lib/d3';
import { drag } from './components/drag';
import { setDefaultTooltipContent, showTooltip } from './components/tooltip';
import { selectNode, clearSelections } from './components/selection';
import { KEY_DATA_ENTITY } from './constants';

const sparseness = 1000;
const linkLength = 100;
const linkStrength = 2;

// https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
export const forceTree = (ecosystem) => {
  const width = 1000;
  const height = 800;
  const minDepth = -1; // Set to 0 to exclude root

  ecosystem.descendants().forEach((d) => {
    d.collapsing = 0;
    d.collapsed = false;
  });
  const isExcluded = (d) => d.data.type === KEY_DATA_ENTITY;
  const allLinks = ecosystem.links().filter((d) => d.source.depth > minDepth && !isExcluded(d.source) && !isExcluded(d.target));
  const allNodes = ecosystem.descendants().filter((d) => d.depth > minDepth && !isExcluded(d));

  const svg = d3.create('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height]);

  let graph;

  const toggleTooltipLock = (entity) => {
    if (graph.locked && graph.locked !== entity.data.id) {
      graph.locked = entity.data.id;
      showTooltip(entity);
      return;
    }
    if (graph.locked) graph.locked = undefined;
    else graph.locked = entity.data.id;
  };

  function update () {
    svg.select('#graph').remove();
    graph = svg.append('g').attr('id', 'graph');

    const notCollapsing = (n) => n.collapsing === 0;
    const nodes = allNodes.filter(notCollapsing);
    const links = allLinks.filter(
      (l) => notCollapsing(l.source) && notCollapsing(l.target),
    );

    const simulation = d3
      .forceSimulation(nodes)
      .velocityDecay(0.4)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(linkLength)
          .strength(linkStrength),
      )
      .force('charge', d3.forceManyBody().strength(-sparseness))
      .force('x', d3.forceX())
      .force('y', d3.forceY());

    const link = graph
      .append('g')
      .attr('id', 'edges')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', (d) => d.source.data.type);

    const node = graph
      .append('g')
      .attr('id', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('id', (d) => d.data.id)
      .attr('class', (d) => d.data.type);

    node
      .append('circle')
      .classed('collapsed', (d) => d.collapsed)
      .attr('r', 15)
      .call(drag(simulation))
      .on('click', (_, i) => toggleTooltipLock(i))
      .on('mouseover', (_, i) => {
        if (graph.locked && graph.locked !== i.data.id) return;
        clearSelections();
        selectNode(i.data.id);
        showTooltip(i);
      })
      .on('mouseout', (_) => {
        if (graph.locked) return;
        clearSelections();
        setDefaultTooltipContent();
      });

    const label = graph.append('g').attr('id', 'labels').selectAll('g')
      .data(nodes)
      .join('g');

    label
      .append('text')
      .attr('text-anchor', 'right')
      .attr('dominant-baseline', 'middle')
      .attr('x', 20)
      // .attr('y', 0)
      // .attr('textLength', 20)
      .text((d) => {
        return d.data.name;
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x} ${d.y})`);
      label.attr('transform', (d) => `translate(${d.x} ${d.y})`);
    });

    node.append('title').text((d) => nodePath(d));

    function zoomed ({ transform }) {
      graph.attr('transform', transform);
    }

    svg.call(
      d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.5, 4])
        .on('zoom', zoomed),
    );
  }

  const nodePath = (d) =>
    d
      .ancestors()
      .map((d) => d.data.id)
      .reverse()
      .join('/');

  update();

  return svg.node();
};
