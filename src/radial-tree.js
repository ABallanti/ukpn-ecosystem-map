import * as d3 from 'd3';
import { KEY_DATA_ENTITY } from './constants';
import { selectNode, clearSelections } from './components/selection';
import { setDefaultTooltipContent, showTooltip } from './components/tooltip';

function autoBox () {
  document.body.appendChild(this);
  const { x, y, width, height } = this.getBBox();
  document.body.removeChild(this);
  return [x, y, width, height];
}

const isExcluded = (d) => d.data.type === KEY_DATA_ENTITY;

// https://observablehq.com/@d3/radial-tidy-tree
export function radialTree (ecosystem) {
  const width = 1200;
  const radius = width / 2;

  const tree = d3
    .tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

  const svg = d3.create('svg');

  // .attr('viewBox', [-width / 2, -height / 2, width, height]);

  const root = tree(ecosystem);
  const links = root.links().filter((d) => !(d.source.depth === 0 || isExcluded(d.source) || isExcluded(d.target)));
  const nodes = root.descendants().filter((d) => !isExcluded(d));
  svg
    .append('g')
    .attr('id', 'edges')
    .attr('fill', 'none')
    .selectAll('path')
    .data(links)
    .join('path')
    .attr(
      'd',
      d3
        .linkRadial()
        .angle((d) => d.x)
        .radius((d) => d.y),
    );

  svg
    .append('g')
    .attr('id', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .join('g')
    .attr('id', (d) => d.data.id)
    .attr('class', (d) => d.data.type)
    .append('circle')
    .attr(
      'transform',
      (d) => `
      rotate(${(d.x * 180) / Math.PI - 90})
      translate(${d.y},0)
    `,
    )
    .attr('r', ({ depth }) => {
      if (depth === 0) return 60;
      if (depth === 1) return 20;
      return 10;
    })
    .on('mouseover', (_, i) => {
      const selectNet = (n, top = false) => {
        const className = top ? 'selected' : 'selected child';
        selectNode(n.data.id, className);
        if (!top) selectNode(n.data.id);
        if (n.children) n.children.forEach(c => selectNet(c));
      };
      clearSelections('#nodes > g', 'selected child');
      selectNet(i, true);
      showTooltip(i);
    })
    .on('mouseout', () => {
      clearSelections('#nodes > g', 'selected child');
      setDefaultTooltipContent();
    });

  svg
    .append('g')
    .attr('id', 'labels')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr(
      'transform',
      (d) => {
        if (d.depth === 1) return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0) rotate(-${(d.x * 180) / Math.PI - 90}) `;
        if (d.depth === 2) return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0) ${d.x > Math.PI ? 'rotate(180)' : ''}`;
      },
    )
    .classed('outer', (d) => d.depth === 2)
    .attr('dx', (d) => {
      if (d.depth === 2) return `${d.x > Math.PI ? '-' : ''}15px`;
      if (d.depth === 1) return `${d.x > Math.PI ? '-' : ''}25px`;
    })
    .attr('dy', (d) => {
      if (d.depth === 0) return '80px';
      return '0.31em';
    })
    // .attr('x', (d) => (d.x < Math.PI === !d.children ? 6 : -6))
    .attr('text-anchor', (d) => {
      if (d.depth === 2) return (d.x > Math.PI) === !d.children ? 'start' : 'end';
      if (d.depth === 1) return d.x > Math.PI ? 'end' : 'start';
      if (d.depth === 0) return 'middle';
    })
    .text((d) => d.data.name)
    .clone(true)
    .lower()
    .attr('stroke', 'white');

  svg.attr('viewBox', autoBox);
  return svg.node();
}
