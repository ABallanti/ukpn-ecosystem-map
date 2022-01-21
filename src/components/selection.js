import * as d3 from '../lib/d3';

export const selectNode = (id) => d3.select(`#${id}`).classed('selected', true);
export const clearSelections = (selector = '#nodes > g') => d3.selectAll(selector).classed('selected', false);
