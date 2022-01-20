import { radialTree } from './radial-tree';
import { tooltipNode } from './components/tooltip';

import './style.css';

import * as d3 from './lib/d3';

d3.csv('ecosystem-tree.csv').then(data => {
  const ecosystem = d3.stratify().id(x => x.id).parentId(x => x.parent)(data);
  const chart = radialTree(ecosystem);

  const root = d3.select('#tree');
  root.append('div', chart).attr('id', 'visualisation').append(() => chart);
  root.append(tooltipNode);
});
