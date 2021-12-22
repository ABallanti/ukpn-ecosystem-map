import * as d3 from './lib/d3';
import { drag } from './components/drag';

const sparseness = 1500;
const linkLength = 25;

const KEY_DATA_ENTITY = 'key-data-entity';

// https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
export const forceTree = (ecosystem, element) => {
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

  const svg = element
    .append('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height]);

  const tooltip = element.append('div').attr('class', 'tooltip empty');
  const clearSelections = () => d3.selectAll('#nodes > g').classed('selected', false);
  const selectNode = (id) => d3.select(`#${id}`).classed('selected', true);
  const showTooltip = (entity) => {
    if (graph.locked && graph.locked !== entity.data.id) return;
    const { id, name, type, description } = entity.data;
    clearSelections();
    selectNode(id);

    const keyDataEntities = entity.descendants().filter(x => x.data.type === KEY_DATA_ENTITY);
    const listKeyDataEntities = (list, heading) => {
      if (list.length < 1) return '';
      return `<h2>${ heading }</h2>
      <ul class='tag-cloud'>
        ${list.map(x => `<li>${x.data.name}</li>`).join('')}
      </ul>`
    }
    const content = `
      <article>
        <h1>${name || id} (<em>${type}</em>)</h1>
        <p>${description}</p>
        ${listKeyDataEntities(keyDataEntities.filter(x => x.data.published === 'Y'), 'Published Key Data Entities')}
        ${listKeyDataEntities(keyDataEntities.filter(x => x.data.published === 'N'), 'Unpublished Key Data Entities')}
      </article>
    `;
    tooltip.classed('empty', false);
    tooltip.html(content);
  };

  const setDefaultTooltipContent = () => {
    const content = `
      <article>
      <h1>Instructions</h1>
      <p>
        Hover over a node to show the metadata.
        Click a node to lock the current selection.
      </p>
      </article>
    `;
    tooltip.html(content);
  }
  setDefaultTooltipContent();

  const hideTooltip = (entity) => {
    if (graph.locked) return;
    clearSelections();
    setDefaultTooltipContent();
  };

  const toggleTooltipLock = (entity) => {
    if (graph.locked && graph.locked !== entity.data.id) {
      graph.locked = entity.data.id;
      showTooltip(entity);
      return;
    }
    if (graph.locked) graph.locked = undefined;
    else graph.locked = entity.data.id;
  }

  function collapseOrExpandChildren(d) {
    if (!d.children) return;

    // if (!d3.event.defaultPrevented) {
    const inc = d.collapsed ? -1 : 1;
    recurse(d);

    function recurse(sourceNode) {
      //check if link is from this node, and if so, collapse
      allLinks.forEach(function (l) {
        if (l.source.id === sourceNode.id) {
          l.target.collapsing += inc;
          recurse(l.target);
        }
      });
    }
    d.collapsed = !d.collapsed;
    // }
    update();
  }

  function update() {
    svg.select('#graph').remove();
    const graph = svg.append('g').attr('id', 'graph');

    const notCollapsing = (n) => n.collapsing == 0;
    const nodes = allNodes.filter(notCollapsing);
    const links = allLinks.filter(
      (l) => notCollapsing(l.source) && notCollapsing(l.target)
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
          .strength(1)
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
      .classed('collapsed', d => d.collapsed)
      .attr('r', 15)
      .call(drag(simulation))
      .on('click', (_, i) => toggleTooltipLock(i))
      .on('mouseover', (_, i) => showTooltip(i))
      .on('mouseout', (_, i) => hideTooltip(i));

    node
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
    });

    node.append('title').text((d) => nodePath(d));
  }

  function zoomed({ transform }) {
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
      .on('zoom', zoomed)
  );

  const nodePath = (d) =>
    d
      .ancestors()
      .map((d) => d.data.id)
      .reverse()
      .join('/');

  update();

  return svg.node();
};
