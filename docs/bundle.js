(function () {
  'use strict';

  // https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
  const forceTree = (ecosystem, element) => {
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

    const node = svg
      .append('g')
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('fill', (d) => (d.children ? null : '#000'))
      .attr('stroke', (d) => (d.children ? null : '#fff'))
      .attr('r', 3.5)
      .call(drag(simulation));

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

  const sid = (() => {
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

  function autoBox() {
    const { x, y, width, height } = this.getBBox();
    return [x, y, width, height];
  }

  // https://observablehq.com/@d3/radial-tidy-tree?collection=@d3/d3-hierarchy
  const radialTree = (ecosystem, element) => {
    const width = 800;
    const radius = width / 2;

    const svg = element.append("svg");

    const tree = d3.tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

    const root = tree(ecosystem);

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y));

    svg.append("g")
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr("transform", d => `
      rotate(${d.x * 180 / Math.PI - 90})
      translate(${d.y},0)
    `)
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 10);

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr("transform", d => `
      rotate(${d.x * 180 / Math.PI - 90}) 
      translate(${d.y},0) 
      rotate(${d.x >= Math.PI ? 180 : 0})
    `)
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .text(d => d.data.node)
      .clone(true).lower()
      .attr("stroke", "white");

    return svg.attr("viewBox", autoBox).node();
  };

  const sunburst = (ecosystem, element) => {
    const width = 800;
    const radius = width / 2;

    const format = d3.format(",d");
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, ecosystem.children.length + 1));

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
        .sort((a, b) => b.value - a.value));

    const root = partition(ecosystem);

    const svg = element.append("svg");

    svg.append("g")
      .attr("fill-opacity", 0.6)
      .selectAll("path")
      .data(root.descendants().filter(d => d.depth))
      .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.node); })
      .attr("d", arc)
      .append("title")
      .text(d => `${d.ancestors().map(d => d.data.node).reverse().join("/")}\n${format(d.value)}`);

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
      .text(d => d.data.node);

    return svg.attr("viewBox", autoBox).node();
  };

  // https://observablehq.com/@d3/circle-packing
  const packChart = (ecosystem, element) => {
    const width = 975;
    const height = 975;
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
    const format = d3.format(",d");

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

  d3.csv('ecosystem-tree.csv').then(data => {
    const ecosystem = d3.stratify().id(x => x.node).parentId(x => x.parent)(data);

    forceTree(ecosystem, d3.select("#tree"));
    packChart(ecosystem, d3.select("#pack-chart"));
    sunburst(ecosystem, d3.select("#sunburst"));
    radialTree(ecosystem, d3.select("#radial-tree"));
  });

})();
