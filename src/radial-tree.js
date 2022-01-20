import * as d3 from './lib/d3';
import { KEY_DATA_ENTITY } from './constants';

function autoBox() {
  document.body.appendChild(this);
  const { x, y, width, height } = this.getBBox();
  document.body.removeChild(this);
  return [x, y, width, height];
}

const isExcluded = (d) => d.data.type === KEY_DATA_ENTITY;

// https://observablehq.com/@d3/radial-tidy-tree
export function radialTree(ecosystem) {
  const width = 1000;
  const radius = width / 2;

  const tree = d3
    .tree()
    .size([2 * Math.PI, radius])
    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

  const svg = d3.create('svg');
  
  // .attr('viewBox', [-width / 2, -height / 2, width, height]);

  const root = tree(ecosystem);
  const links = root.links().filter((d) => !isExcluded(d.source) && !isExcluded(d.target));
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
        .radius((d) => d.y)
    );

  svg
    .append('g')
    .attr('id', 'nodes')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr(
      'transform',
      (d) => `
      rotate(${(d.x * 180) / Math.PI - 90})
      translate(${d.y},0)
    `
    )
    .attr('class', (d) => d.data.type)
    .attr('r', ({depth}) => {
      if ( depth === 0 ) return 60;
      if ( depth === 1 ) return 20;
      return 10;
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
        if (d.depth === 2) return `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`;
      }
    )
    .classed('outer', (d) => d.depth === 2)
    .attr('dx', (d) => {
      if (d.depth === 2) return '15px';
      if (d.depth === 1) return '25px';
    })
    .attr('dy', '0.31em')
    // .attr('x', (d) => (d.x < Math.PI === !d.children ? 6 : -6))
    // .attr('text-anchor', (d) => d.x < Math.PI === !d.children ? 'start' : 'end' )
    .text((d) => d.data.name)
    .clone(true)
    .lower()
    .attr('stroke', 'white');

  svg.attr('viewBox', autoBox);
  return svg.node();
}
