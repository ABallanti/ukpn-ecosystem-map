import { forceTree } from './force-tree';
import { radialTree } from './radial-tree';
import { sunburst } from './sunburst';
import { packChart } from './pack-chart';

d3.csv('ecosystem-tree.csv').then(data => {
  const ecosystem = d3.stratify().id(x => x.node).parentId(x => x.parent)(data);

  forceTree(ecosystem, d3.select("#tree"));
  packChart(ecosystem, d3.select("#pack-chart"));
  sunburst(ecosystem, d3.select("#sunburst"));
  radialTree(ecosystem, d3.select("#radial-tree"));
});