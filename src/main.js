import { forceTree } from './force-tree';

import './style.css';

import * as d3 from './lib/d3';

d3.csv('ecosystem-tree.csv').then(data => {
  const ecosystem = d3.stratify().id(x => x.id).parentId(x => x.parent)(data);

  forceTree(ecosystem, d3.select("#tree"));
});
