import * as d3 from 'd3';

export const selectNode = (id, className = 'selected') => d3.select(`#${id}`).classed(className, true);
export const clearSelections = (selector = '#nodes > g', className = 'selected') => d3.selectAll(selector).classed(className, false);
