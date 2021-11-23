import { sid } from './util';

// https://observablehq.com/@d3/circle-packing
export const packChart = (ecosystem, element) => {
  const width = 975
  const height = 975
  const pack = data => d3.pack()
    .size([width - 2, height - 2])
    .padding(3)
    (data
      .sum(d => d.children ? 0 : 1)
      .sort((a, b) => b.value - a.value));

  const root = pack(ecosystem);

  const svg = element.append("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("font", "10px sans-serif")
    .attr("text-anchor", "middle");

  const shadow = sid('filter');

  svg.append("filter")
    .attr("id", shadow)
    .append("feDropShadow")
    .attr("flood-opacity", 0.3)
    .attr("dx", 0)
    .attr("dy", 1);

  const node = svg.selectAll("g")
    .data(d3.group(root.descendants(), d => d.height))
    .join("g")
    .attr("filter", `url(#${shadow}`)
    .selectAll("g")
    .data(d => d[1])
    .join("g")
    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  const color = d3.scaleSequential([8, 0], d3.interpolateMagma);
  const format = d3.format(",d")

  node.append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => color(d.height));

  const leaf = node.filter(d => !d.children);

  leaf.select("circle")
    .attr("id", d => d.leafUid = sid('leaf'));

  leaf.append("clipPath")
    .attr("id", d => d.clipUid = sid('clip'))
    .append("use")
    .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
    .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.node.split(/(?=[A-Z][a-z])|\s+/g))
    .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
    .text(d => d);

  node.append("title")
    .text(d => `${d.ancestors().map(d => d.data.node).reverse().join("/")}\n${format(d.value)}`);

  return svg.node();
};