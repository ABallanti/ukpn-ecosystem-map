(function () {
  'use strict';

  // https://observablehq.com/@d3/force-directed-tree?collection=@d3/d3-hierarchy
  var forceTree = function forceTree(ecosystem, element) {
    var width = 200;
    var height = width;
    var links = ecosystem.links();
    var nodes = ecosystem.descendants();
    var simulation = d3.forceSimulation(nodes).force('link', d3.forceLink(links).id(function (d) {
      return d.id;
    }).distance(0).strength(1)).force('charge', d3.forceManyBody().strength(-50)).force('x', d3.forceX()).force('y', d3.forceY());
    var svg = element.append('svg').attr('viewBox', [-width / 2, -height / 2, width, height]);
    var link = svg.append('g').attr('stroke', '#999').attr('stroke-opacity', 0.6).selectAll('line').data(links).join('line');

    var drag = function drag(simulation) {
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

      return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended);
    };

    var node = svg.append('g').attr('fill', '#fff').attr('stroke', '#000').attr('stroke-width', 1.5).selectAll('circle').data(nodes).join('circle').attr('fill', function (d) {
      return d.children ? null : '#000';
    }).attr('stroke', function (d) {
      return d.children ? null : '#fff';
    }).attr('r', 3.5).call(drag(simulation));
    node.append('title').text(function (d) {
      return "".concat(d.ancestors().map(function (d) {
        return d.data.node;
      }).reverse().join('/'));
    });
    simulation.on('tick', function () {
      link.attr('x1', function (d) {
        return d.source.x;
      }).attr('y1', function (d) {
        return d.source.y;
      }).attr('x2', function (d) {
        return d.target.x;
      }).attr('y2', function (d) {
        return d.target.y;
      });
      node.attr('cx', function (d) {
        return d.x;
      }).attr('cy', function (d) {
        return d.y;
      });
    }); // WAT DIS? invalidation.then(() => simulation.stop());

    return svg.node();
  };

  var sid = function () {
    var _marked = /*#__PURE__*/regeneratorRuntime.mark(sequence);

    var sequences = {};

    function sequence(ref) {
      var i;
      return regeneratorRuntime.wrap(function sequence$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              i = 0;

            case 1:

              _context.next = 4;
              return "".concat(ref, "-").concat(i);

            case 4:
              i++;
              _context.next = 1;
              break;

            case 7:
            case "end":
              return _context.stop();
          }
        }
      }, _marked);
    }

    return function (id) {
      if (!sequences[id]) sequences[id] = sequence(id);
      return sequences[id].next().value;
    };
  }();
  function autoBox() {
    var _this$getBBox = this.getBBox(),
        x = _this$getBBox.x,
        y = _this$getBBox.y,
        width = _this$getBBox.width,
        height = _this$getBBox.height;

    return [x, y, width, height];
  }

  var radialTree = function radialTree(ecosystem, element) {
    var width = 800;
    var radius = width / 2;
    var svg = element.append("svg");
    var tree = d3.tree().size([2 * Math.PI, radius]).separation(function (a, b) {
      return (a.parent == b.parent ? 1 : 2) / a.depth;
    });
    var root = tree(ecosystem);
    svg.append("g").attr("fill", "none").attr("stroke", "#555").attr("stroke-opacity", 0.4).attr("stroke-width", 1.5).selectAll("path").data(root.links()).join("path").attr("d", d3.linkRadial().angle(function (d) {
      return d.x;
    }).radius(function (d) {
      return d.y;
    }));
    svg.append("g").selectAll("circle").data(root.descendants()).join("circle").attr("transform", function (d) {
      return "\n      rotate(".concat(d.x * 180 / Math.PI - 90, ")\n      translate(").concat(d.y, ",0)\n    ");
    }).attr("fill", function (d) {
      return d.children ? "#555" : "#999";
    }).attr("r", 10);
    svg.append("g").attr("font-family", "sans-serif").attr("font-size", 10).attr("stroke-linejoin", "round").attr("stroke-width", 3).selectAll("text").data(root.descendants()).join("text").attr("transform", function (d) {
      return "\n      rotate(".concat(d.x * 180 / Math.PI - 90, ") \n      translate(").concat(d.y, ",0) \n      rotate(").concat(d.x >= Math.PI ? 180 : 0, ")\n    ");
    }).attr("dy", "0.31em").attr("x", function (d) {
      return d.x < Math.PI === !d.children ? 6 : -6;
    }).attr("text-anchor", function (d) {
      return d.x < Math.PI === !d.children ? "start" : "end";
    }).text(function (d) {
      return d.data.node;
    }).clone(true).lower().attr("stroke", "white");
    return svg.attr("viewBox", autoBox).node();
  };

  var sunburst = function sunburst(ecosystem, element) {
    var width = 800;
    var radius = width / 2;
    var format = d3.format(",d");
    var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, ecosystem.children.length + 1));
    var arc = d3.arc().startAngle(function (d) {
      return d.x0;
    }).endAngle(function (d) {
      return d.x1;
    }).padAngle(function (d) {
      return Math.min((d.x1 - d.x0) / 2, 0.005);
    }).padRadius(radius / 2).innerRadius(function (d) {
      return d.y0;
    }).outerRadius(function (d) {
      return d.y1 - 1;
    });

    var partition = function partition(data) {
      return d3.partition().size([2 * Math.PI, radius])(data.sum(function (d) {
        return 1;
      }).sort(function (a, b) {
        return b.value - a.value;
      }));
    };

    var root = partition(ecosystem);
    var svg = element.append("svg");
    svg.append("g").attr("fill-opacity", 0.6).selectAll("path").data(root.descendants().filter(function (d) {
      return d.depth;
    })).join("path").attr("fill", function (d) {
      while (d.depth > 1) {
        d = d.parent;
      }

      return color(d.data.node);
    }).attr("d", arc).append("title").text(function (d) {
      return "".concat(d.ancestors().map(function (d) {
        return d.data.node;
      }).reverse().join("/"), "\n").concat(format(d.value));
    });
    svg.append("g").attr("pointer-events", "none").attr("text-anchor", "middle").attr("font-size", 10).attr("font-family", "sans-serif").selectAll("text").data(root.descendants().filter(function (d) {
      return d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10;
    })).join("text").attr("transform", function (d) {
      var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      var y = (d.y0 + d.y1) / 2;
      return "rotate(".concat(x - 90, ") translate(").concat(y, ",0) rotate(").concat(x < 180 ? 0 : 180, ")");
    }).attr("dy", "0.35em").text(function (d) {
      return d.data.node;
    });
    return svg.attr("viewBox", autoBox).node();
  };

  var packChart = function packChart(ecosystem, element) {
    var width = 975;
    var height = 975;

    var pack = function pack(data) {
      return d3.pack().size([width - 2, height - 2]).padding(3)(data.sum(function (d) {
        return d.children ? 0 : 1;
      }).sort(function (a, b) {
        return b.value - a.value;
      }));
    };

    var root = pack(ecosystem);
    var svg = element.append("svg").attr("viewBox", [0, 0, width, height]).style("font", "10px sans-serif").attr("text-anchor", "middle");
    var shadow = sid('filter');
    svg.append("filter").attr("id", shadow).append("feDropShadow").attr("flood-opacity", 0.3).attr("dx", 0).attr("dy", 1);
    var node = svg.selectAll("g").data(d3.group(root.descendants(), function (d) {
      return d.height;
    })).join("g").attr("filter", "url(#".concat(shadow)).selectAll("g").data(function (d) {
      return d[1];
    }).join("g").attr("transform", function (d) {
      return "translate(".concat(d.x + 1, ",").concat(d.y + 1, ")");
    });
    var color = d3.scaleSequential([8, 0], d3.interpolateMagma);
    var format = d3.format(",d");
    node.append("circle").attr("r", function (d) {
      return d.r;
    }).attr("fill", function (d) {
      return color(d.height);
    });
    var leaf = node.filter(function (d) {
      return !d.children;
    });
    leaf.select("circle").attr("id", function (d) {
      return d.leafUid = sid('leaf');
    });
    leaf.append("clipPath").attr("id", function (d) {
      return d.clipUid = sid('clip');
    }).append("use").attr("xlink:href", function (d) {
      return d.leafUid.href;
    });
    leaf.append("text").attr("clip-path", function (d) {
      return d.clipUid;
    }).selectAll("tspan").data(function (d) {
      return d.data.node.split(/(?=[A-Z][a-z])|\s+/g);
    }).join("tspan").attr("x", 0).attr("y", function (d, i, nodes) {
      return "".concat(i - nodes.length / 2 + 0.8, "em");
    }).text(function (d) {
      return d;
    });
    node.append("title").text(function (d) {
      return "".concat(d.ancestors().map(function (d) {
        return d.data.node;
      }).reverse().join("/"), "\n").concat(format(d.value));
    });
    return svg.node();
  };

  d3.csv('ecosystem-tree.csv').then(function (data) {
    var ecosystem = d3.stratify().id(function (x) {
      return x.node;
    }).parentId(function (x) {
      return x.parent;
    })(data);
    forceTree(ecosystem, d3.select("#tree"));
    packChart(ecosystem, d3.select("#pack-chart"));
    sunburst(ecosystem, d3.select("#sunburst"));
    radialTree(ecosystem, d3.select("#radial-tree"));
  });

})();
