import { renderActionLabel } from '../../../../components/experience/action-label';
import type { HeaderAssets, HeaderContent, Role } from './types';
import { GEOMETRY } from './config';
import { portraitPlacement } from './portrait-frame';

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

const PAUSE_ICON =
  '<svg class="mah-icon mah-icon--pause" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5h2.6v11H4zM9.4 2.5H12v11H9.4z" fill="currentColor"/></svg>' +
  '<svg class="mah-icon mah-icon--play" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2.5 13 8l-8.5 5.5z" fill="currentColor"/></svg>';

/** The same controls can live in the hero or in its existing navbar. */
export function renderRoleControls(c: HeaderContent, role: Role, compact = false): string {
  const tab = (r: Role) =>
    `<button type="button" class="mah-tab" data-mah-role="${r}" aria-label="${esc(c.roleLabels[r])}" aria-pressed="${r === role}">${esc(compact ? (r === 'engineer' ? 'Frontend' : 'Designer') : c.roleLabels[r])}<i aria-hidden="true"></i></button>`;
  return `<div class="mah-tabs" data-mah-part data-mah-tabs data-on="${role}" role="group" aria-label="${esc(c.rolesGroupLabel)}">
    ${tab('engineer')}${tab('designer')}
    <button type="button" class="mah-pause" data-mah-pause aria-pressed="false" aria-label="Pause the role animation">${PAUSE_ICON}</button>
  </div>`;
}

/** Markup for the whole header. Every changing element carries `data-mah-part`. */
export function renderHeader(c: HeaderContent, a: HeaderAssets, role: Role, theme: string, includeControls = true): string {
  const heading = c.headingLevel ? `<h${c.headingLevel} id="intro-heading" class="mah-sr">${esc(c.heading)}</h${c.headingLevel}>` : '';
  const ctas = c.ctas
    .map((x) => {
      // Homepage actions keep their own fixed palette, outside both the role
      // sweep and the shared hover animation used elsewhere in the portfolio.
      const behavior = c.introduction ? 'data-home-action' : `data-flow-action="${x.variant === 'primary' ? '' : 'paper'}" data-mah-part`;
      const label = c.introduction
        ? `<span>${esc(x.label)}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>`
        : renderActionLabel(x.label);
      return `<a class="${x.variant === 'primary' ? 'mah-btn' : 'mah-link'}" ${behavior} href="${esc(x.href)}">${label}</a>`;
    })
    .join('');
  const off = (r: Role) => (r === role ? '' : ' is-off');
  const back = portraitPlacement('designer');
  const backStyle = `left:${back.x / GEOMETRY.photoW * 100}%;top:${back.y / GEOMETRY.photoH * 100}%;width:${back.width / GEOMETRY.photoW * 100}%;height:${back.height / GEOMETRY.photoH * 100}%`;
  return `
<section class="mah" data-role="${role}" data-theme="${theme}" data-layout="auto" aria-label="Introduction">
  ${heading}
  <div class="mah-room" aria-hidden="true"><img class="mah-room-img" ${role === 'designer' ? 'src' : 'data-src'}="${esc(a.room)}" alt="" decoding="async"><span class="mah-fog"></span></div>
  <div class="mah-stage">
    <div class="mah-word" aria-hidden="true"></div>
    <div class="mah-photo" role="img" aria-label="${esc(c.photoLabel)}">
      <picture>
        ${a.frontCompact ? `<source media="(max-width: 1279px)" srcset="${esc(a.frontCompact)}">` : ''}
        <img class="mah-photo-img mah-photo-front" src="${esc(a.front)}" alt="" width="${GEOMETRY.photoW}" height="${GEOMETRY.photoH}" decoding="async">
      </picture>
      <img class="mah-photo-img mah-photo-back" ${role === 'designer' ? 'src' : 'data-src'}="${esc(a.back)}" alt="" width="${GEOMETRY.photoW}" height="${GEOMETRY.photoH}" style="${backStyle}" decoding="async">
      <canvas class="mah-photo-canvas" aria-hidden="true"></canvas>
    </div>
  </div>
  <div class="mah-copy">
    <div class="mah-col mah-col--left">
      ${includeControls ? renderRoleControls(c, role) : ''}
      <p class="mah-big" data-mah-part>${esc(c.years)}</p>
      <div class="mah-line" data-mah-part data-mah-line>
        ${c.introduction ? `<p class="mah-line-text${off('engineer')}" data-for="engineer">${esc(c.introduction.engineer)}</p>` : `<ul class="mah-stack${off('engineer')}" data-for="engineer" aria-label="Stack">${c.stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`}
        <p class="mah-line-text${off('designer')}" data-for="designer">${esc(c.introduction?.designer ?? c.designerLine)}</p>
      </div>
      ${c.introduction ? `<div class="mah-ctas">${ctas}</div>` : ''}
    </div>
    <div class="mah-col mah-col--right">
      ${c.introduction ? `<a class="mah-featured-project" href="${esc(c.introduction.project.href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(c.introduction.project.name)} app in a new tab">
        <img src="${esc(c.introduction.project.image)}" alt="" width="120" height="104" />
        <span><span class="mah-featured-label">Latest project</span><strong>${esc(c.introduction.project.name)}</strong><span class="mah-featured-description">${esc(c.introduction.project.description)}</span></span>
      </a>` : `
      <p class="mah-big mah-proof" data-mah-part>${esc(c.proof)}</p>
      <div class="mah-ctas">${ctas}</div>`}
    </div>
  </div>
  <span class="mah-measure" aria-hidden="true"></span>
  <span class="mah-probe mah-m-e" hidden></span><span class="mah-probe mah-m-d" hidden></span>
</section>`;
}
