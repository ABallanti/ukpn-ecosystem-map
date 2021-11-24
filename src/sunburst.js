import { autoBox } from './util';
import * as d3 from 'd3';

export const sunburst = (ecosystem, element) => {
  const width = 800;
  const radius = width / 2;

  const format = d3.format(",d");
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, ecosystem.children.length + 1))

  const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1);

  const partition = data => d3.partition()
    .size([2 * Math.PI, radius])
    (data
      .sum(d => 1)
      .sort((a, b) => b.value - a.value))

  const root = partition(ecosystem);

  const svg = element.append("svg");

  svg.append("g")
    .attr("fill-opacity", 0.6)
    .selectAll("path")
    .data(root.descendants().filter(d => d.depth))
    .join("path")
    .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.id); })
    .attr("d", arc)
    .append("title")
    .text(d => `${d.ancestors().map(d => d.data.id).reverse().join("/")}\n${format(d.value)}`);

  svg.append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .selectAll("text")
    .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
    .join("text")
    .attr("transform", function (d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    })
    .attr("dy", "0.35em")
    .text(d => d.data.id);

  return svg.attr("viewBox", autoBox).node();
}

