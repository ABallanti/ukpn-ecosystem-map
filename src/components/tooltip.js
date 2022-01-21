import * as d3 from '../lib/d3';
import { KEY_DATA_ENTITY } from '../constants';

export const tooltip = d3.create('aside').attr('class', 'tooltip empty');

export const setDefaultTooltipContent = () => {
  const content = `
    <article>
    <h1>Instructions</h1>
    <p>
      Hover over a node to show the metadata.
      Click a node to lock the current selection.
    </p>
    <p>
      You can zoom and pan using your pointing device or touch.
      Double clicking / tapping will zoom and recentre the visualisation.
      Pressing shift and double clicking will zoom out.
    </p>
    </article>
  `;
  tooltip.html(content);
};
setDefaultTooltipContent();

export const showTooltip = (entity) => {
  const { id, name, type, description } = entity.data;

  const keyDataEntities = entity.descendants().filter(x => x.data.type === KEY_DATA_ENTITY);
  const listKeyDataEntities = (list, heading) => {
    if (list.length < 1) return '';
    return `<h2>${heading}</h2>
    <ul class='tag-cloud'>
      ${list.map(x => `<li>${x.data.name}</li>`).join('')}
    </ul>`;
  };
  const content = `
    <article>
      <h1>${name || id} (<em>${type}</em>)</h1>
      <p>${description}</p>
      ${listKeyDataEntities(keyDataEntities.filter(x => x.data.published === 'Y'), 'Published Key Data Entities')}
      ${listKeyDataEntities(keyDataEntities.filter(x => x.data.published === 'N'), 'Unpublished Key Data Entities')}
    </article>
  `;
  tooltip.classed('empty', false);
  tooltip.html(content);
};

export const tooltipNode = () => tooltip.node();
