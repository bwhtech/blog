/**
 * The dashboard the /lab/sheet scene turns into: number cards, a visits chart,
 * a status donut, visits by village and the beneficiary list, all drawn from
 * one slice of the sample data so the numbers always agree.
 *
 * The page drives `progress(q)` from scroll while the dashboard builds itself
 * (0 is empty frames, 1 is drawn). Once it is live, the filters and the village
 * bars change the slice, and every part moves to the new numbers.
 */
import { animate } from 'motion';
import {
	DEFAULT_FILTERS,
	STATUSES,
	dateOf,
	rangeOf,
	slice,
	statusOf,
	type Filters,
	type Slice,
	type Status,
} from '../../data/sample-programme';
import { EASE_OUT, motionAllowed } from './motion';

const SVG = 'http://www.w3.org/2000/svg';
const ROW_HEIGHT = 33;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const seg = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const number = new Intl.NumberFormat('en-IN');
const shortDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const longDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const STATUS_KEY: Record<Status, string> = { Visited: 'visited', 'Follow up': 'follow', Due: 'due' };

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent?: Element) {
	const element = document.createElementNS(SVG, tag);
	Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, String(value)));
	parent?.appendChild(element);
	return element;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text?: string) {
	const element = document.createElement(tag);
	if (className) element.className = className;
	if (text !== undefined) element.textContent = text;
	return element;
}

/** A tidy axis: 0 up to a round top, in two to four steps. */
function axis(max: number) {
	const target = Math.max(max, 3) / 3;
	const pow = 10 ** Math.floor(Math.log10(target));
	const step = [1, 2, 2.5, 5, 10].map((s) => s * pow).find((s) => s >= target) ?? 10 * pow;
	const top = Math.ceil(Math.max(max, 1) / step) * step;
	return { top, ticks: Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step) };
}

/** Monotone cubic through the points: smooth, and never overshoots a value. */
function curve(points: [number, number][]) {
	const n = points.length;
	if (n === 0) return '';
	if (n === 1) return `M${points[0][0]},${points[0][1]}`;
	const slopes: number[] = [];
	for (let i = 0; i < n - 1; i++) slopes.push((points[i + 1][1] - points[i][1]) / (points[i + 1][0] - points[i][0]));
	const tangents = [slopes[0]];
	for (let i = 1; i < n - 1; i++) {
		const a = slopes[i - 1];
		const b = slopes[i];
		tangents.push(a * b <= 0 ? 0 : (2 * a * b) / (a + b));
	}
	tangents.push(slopes[n - 2]);
	let d = `M${points[0][0]},${points[0][1]}`;
	for (let i = 0; i < n - 1; i++) {
		const [x0, y0] = points[i];
		const [x1, y1] = points[i + 1];
		const h = (x1 - x0) / 3;
		d += `C${x0 + h},${y0 + h * tangents[i]} ${x1 - h},${y1 - h * tangents[i + 1]} ${x1},${y1}`;
	}
	return d;
}

/** Visits per day or week: a line over a soft wash, with a crosshair readout. */
class AreaChart {
	private svg: SVGSVGElement;
	private tip: HTMLElement;
	private summary: HTMLElement;
	private values: number[] = [];
	private dates: Date[] = [];
	private bin: 'day' | 'week' = 'week';
	private q = 0;
	private reveal = 1;
	private hover: number | null = null;
	private box = { width: 0, height: 0 };
	private parts: {
		line: SVGPathElement;
		area: SVGPathElement;
		dot: SVGCircleElement;
		label: SVGTextElement;
		cross: SVGLineElement;
		crossDot: SVGCircleElement;
	} | null = null;
	private scale = { x: (_i: number) => 0, y: (_v: number) => 0, top: 1 };

	constructor(private root: HTMLElement) {
		this.svg = root.querySelector('svg')!;
		this.tip = root.querySelector<HTMLElement>('[data-tip]')!;
		this.summary = root.querySelector<HTMLElement>('[data-summary]')!;
		new ResizeObserver(() => this.layout()).observe(root);
		root.addEventListener('pointermove', (event) => this.point(event.clientX));
		root.addEventListener('pointerleave', () => this.setHover(null));
		root.addEventListener('focus', () => this.setHover(this.values.length - 1));
		root.addEventListener('blur', () => this.setHover(null));
		root.addEventListener('keydown', (event) => {
			if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
			event.preventDefault();
			const step = event.key === 'ArrowLeft' ? -1 : 1;
			this.setHover(Math.min(this.values.length - 1, Math.max(0, (this.hover ?? this.values.length - 1) + step)));
		});
	}

	set(data: Slice, smooth: boolean) {
		const next = data.series.map((point) => point.value);
		const from = this.values;
		this.dates = data.series.map((point) => point.date);
		this.bin = data.range.bin;
		const top = Math.max(...next);
		const peak = data.series[next.indexOf(top)];
		const when = this.bin === 'day' ? `on ${shortDate.format(peak.date)}` : `in the week of ${shortDate.format(peak.date)}`;
		this.summary.textContent = data.visits
			? `${number.format(data.visits)} visits in the ${data.range.label.toLowerCase()}. Busiest: ${top} ${when}.`
			: `No visits in the ${data.range.label.toLowerCase()}.`;

		if (!smooth || from.length === 0) {
			this.values = next;
			this.layout();
			return;
		}
		if (from.length !== next.length) {
			// A new range has a new x-axis: draw it in again rather than morph.
			this.values = next;
			this.layout();
			animate(0, 1, { duration: 0.7, ease: EASE_OUT, onUpdate: (t) => ((this.reveal = t), this.paint()) });
			return;
		}
		this.values = next;
		this.layout(false);
		animate(0, 1, {
			duration: 0.5,
			ease: EASE_OUT,
			onUpdate: (t) => this.paint(from.map((value, i) => lerp(value, next[i], t))),
		});
	}

	progress(q: number) {
		this.q = q;
		this.paint();
	}

	private layout(paint = true) {
		const { width, height } = this.root.getBoundingClientRect();
		if (!width || !height) return;
		this.box = { width, height };
		const pad = { left: 30, right: 14, top: 18, bottom: 22 };
		const { top, ticks } = axis(Math.max(...this.values, 1));
		const plotW = width - pad.left - pad.right;
		const plotH = height - pad.top - pad.bottom;
		const n = Math.max(this.values.length - 1, 1);
		this.scale = {
			x: (i) => pad.left + (i / n) * plotW,
			y: (v) => pad.top + plotH - (v / top) * plotH,
			top,
		};

		this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
		this.svg.replaceChildren();
		const defs = svg('defs', {}, this.svg);
		const gradient = svg('linearGradient', { id: 'area-wash', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
		svg('stop', { offset: '0%', 'stop-color': 'var(--viz-blue)', 'stop-opacity': 0.2 }, gradient);
		svg('stop', { offset: '100%', 'stop-color': 'var(--viz-blue)', 'stop-opacity': 0.02 }, gradient);

		ticks.forEach((tick) => {
			const y = Math.round(this.scale.y(tick)) + 0.5;
			svg('line', { x1: pad.left, x2: width - pad.right, y1: y, y2: y, class: 'viz-grid' }, this.svg);
			const label = svg('text', { x: pad.left - 8, y: y + 3.5, 'text-anchor': 'end', class: 'viz-tick' }, this.svg);
			label.textContent = number.format(tick);
		});
		// Three or four dates along the bottom, always including the last.
		const every = Math.max(1, Math.ceil(this.values.length / 4));
		this.dates.forEach((date, i) => {
			if ((this.values.length - 1 - i) % every !== 0) return;
			const label = svg('text', { x: this.scale.x(i), y: height - 6, 'text-anchor': i === 0 ? 'start' : 'middle', class: 'viz-tick' }, this.svg);
			label.textContent = shortDate.format(date);
		});

		const area = svg('path', { fill: 'url(#area-wash)' }, this.svg);
		const line = svg('path', { class: 'viz-line', pathLength: 1 }, this.svg);
		const cross = svg('line', { y1: pad.top - 6, y2: pad.top + plotH, class: 'viz-cross', opacity: 0 }, this.svg);
		const crossDot = svg('circle', { r: 4, class: 'viz-dot', opacity: 0 }, this.svg);
		const dot = svg('circle', { r: 4, class: 'viz-dot', opacity: 0 }, this.svg);
		const label = svg('text', { 'text-anchor': 'end', class: 'viz-end', opacity: 0 }, this.svg);
		this.parts = { line, area, dot, label, cross, crossDot };
		if (paint) this.paint();
	}

	private paint(values = this.values) {
		if (!this.parts || values.length === 0) return;
		const { line, area, dot, label } = this.parts;
		const points = values.map((value, i) => [this.scale.x(i), this.scale.y(value)] as [number, number]);
		const d = curve(points);
		const base = this.scale.y(0);
		line.setAttribute('d', d);
		area.setAttribute('d', `${d}L${points[points.length - 1][0]},${base}L${points[0][0]},${base}Z`);

		const draw = ease(seg(this.q, 0.1, 0.65)) * this.reveal;
		line.style.strokeDasharray = '1 1';
		line.style.strokeDashoffset = String(1 - draw);
		area.style.opacity = String(ease(seg(this.q, 0.35, 0.75)) * this.reveal);
		const end = seg(this.q, 0.62, 0.72) * (this.reveal >= 1 ? 1 : 0);
		const [x, y] = points[points.length - 1];
		dot.setAttribute('cx', String(x));
		dot.setAttribute('cy', String(y));
		dot.style.opacity = String(this.hover === null ? end : 0);
		// The label sits on the side of the dot the line does not come from.
		const falling = values.length > 1 && values[values.length - 2] > values[values.length - 1];
		label.setAttribute('x', String(x - 8));
		label.setAttribute('y', String(falling ? y + 17 : y - 9));
		label.textContent = number.format(Math.round(values[values.length - 1]));
		label.style.opacity = String(this.hover === null ? end : 0);
	}

	private point(clientX: number) {
		if (!this.values.length) return;
		const box = this.root.getBoundingClientRect();
		const x = clientX - box.left;
		let best = 0;
		this.values.forEach((_, i) => {
			if (Math.abs(this.scale.x(i) - x) < Math.abs(this.scale.x(best) - x)) best = i;
		});
		this.setHover(best);
	}

	private setHover(index: number | null) {
		if (!this.parts || this.q < 1) index = null;
		this.hover = index;
		const { cross, crossDot } = this.parts ?? {};
		if (!cross || !crossDot) return;
		if (index === null) {
			cross.setAttribute('opacity', '0');
			crossDot.setAttribute('opacity', '0');
			this.tip.hidden = true;
			this.paint();
			return;
		}
		const x = this.scale.x(index);
		const y = this.scale.y(this.values[index]);
		cross.setAttribute('x1', String(x));
		cross.setAttribute('x2', String(x));
		cross.setAttribute('opacity', '1');
		crossDot.setAttribute('cx', String(x));
		crossDot.setAttribute('cy', String(y));
		crossDot.setAttribute('opacity', '1');

		const date = this.dates[index];
		const when = this.bin === 'day' ? longDate.format(date) : `Week of ${shortDate.format(date)}`;
		const value = this.tip.querySelector('[data-tip-value]')!;
		const label = this.tip.querySelector('[data-tip-label]')!;
		value.textContent = number.format(this.values[index]);
		label.textContent = when;
		this.tip.hidden = false;
		const width = this.tip.offsetWidth;
		const left = Math.min(Math.max(x - width / 2, 0), this.box.width - width);
		this.tip.style.transform = `translate(${left}px, ${Math.max(y - 54, 0)}px)`;
		this.paint();
	}
}

/** Visited, follow up and due as one ring, with the count in the middle. */
class Donut {
	private segments: SVGCircleElement[];
	private center: { value: HTMLElement; label: HTMLElement };
	private legend: Map<Status, HTMLElement>;
	private counts: Record<Status, number> = { Visited: 0, 'Follow up': 0, Due: 0 };
	private shown = this.counts;
	private q = 0;
	private focus: Status | null = null;
	private static R = 46;
	private static C = 2 * Math.PI * Donut.R;

	constructor(private root: HTMLElement) {
		const ring = root.querySelector('svg')!;
		this.segments = STATUSES.map((status) => {
			const circle = svg('circle', { cx: 60, cy: 60, r: Donut.R, class: `viz-seg viz-${STATUS_KEY[status]}`, transform: 'rotate(-90 60 60)' }, ring);
			circle.addEventListener('pointerenter', () => this.setFocus(status));
			circle.addEventListener('pointerleave', () => this.setFocus(null));
			return circle;
		});
		this.center = {
			value: root.querySelector<HTMLElement>('[data-donut-value]')!,
			label: root.querySelector<HTMLElement>('[data-donut-label]')!,
		};
		this.legend = new Map(
			STATUSES.map((status) => {
				const row = root.querySelector<HTMLElement>(`[data-legend="${STATUS_KEY[status]}"]`)!;
				row.addEventListener('pointerenter', () => this.setFocus(status));
				row.addEventListener('pointerleave', () => this.setFocus(null));
				return [status, row];
			}),
		);
	}

	set(data: Slice, smooth: boolean) {
		const from = this.shown;
		this.counts = data.status;
		const total = data.people.length;
		this.root.setAttribute(
			'aria-label',
			`Status: ${STATUSES.map((s) => `${data.status[s]} ${s.toLowerCase()}`).join(', ')}, of ${total} beneficiaries`,
		);
		STATUSES.forEach((status) => {
			const row = this.legend.get(status)!;
			row.querySelector('[data-legend-n]')!.textContent = number.format(data.status[status]);
			row.querySelector('[data-legend-share]')!.textContent = total ? `${Math.round((data.status[status] / total) * 100)}%` : '–';
		});
		if (!smooth) {
			this.shown = this.counts;
			this.paint();
			return;
		}
		const to = this.counts;
		animate(0, 1, {
			duration: 0.5,
			ease: EASE_OUT,
			onUpdate: (t) => {
				this.shown = Object.fromEntries(STATUSES.map((s) => [s, lerp(from[s], to[s], t)])) as Record<Status, number>;
				this.paint();
			},
		});
	}

	progress(q: number) {
		this.q = q;
		this.paint();
	}

	private paint() {
		const total = STATUSES.reduce((sum, s) => sum + this.shown[s], 0);
		const sweep = ease(seg(this.q, 0.2, 0.75));
		let offset = 0;
		STATUSES.forEach((status, i) => {
			const share = total ? this.shown[status] / total : 0;
			const length = share * Donut.C * sweep;
			// A 2px gap of surface between segments, never a stroke around them.
			const drawn = Math.max(0, length - (share < 1 ? 2 : 0));
			const circle = this.segments[i];
			circle.style.strokeDasharray = `${drawn} ${Donut.C}`;
			circle.style.strokeDashoffset = String(-offset);
			circle.style.opacity = this.focus && this.focus !== status ? '0.3' : '1';
			offset += length;
		});
		this.legend.forEach((row, status) => row.toggleAttribute('data-dim', !!this.focus && this.focus !== status));

		const visited = this.shown.Visited + this.shown['Follow up'];
		const count = (n: number) => number.format(Math.round(n * ease(seg(this.q, 0, 0.6))));
		if (this.focus) {
			this.center.value.textContent = count(this.shown[this.focus]);
			this.center.label.textContent = this.focus.toLowerCase();
		} else {
			this.center.value.textContent = total ? `${Math.round((visited / total) * 100 * ease(seg(this.q, 0, 0.6)))}%` : '–';
			this.center.label.textContent = 'visited';
		}
	}

	private setFocus(status: Status | null) {
		if (this.q < 1) status = null;
		this.focus = status;
		this.paint();
	}
}

/** Visits by village, longest first. A bar is also a filter. */
class VillageBars {
	private rows = new Map<string, HTMLButtonElement>();
	private values: Record<string, number> = {};
	private shown: Record<string, number> = {};
	private max = 1;
	private q = 0;

	constructor(
		private root: HTMLElement,
		onPick: (village: string) => void,
	) {
		root.querySelectorAll<HTMLButtonElement>('[data-village]').forEach((row) => {
			this.rows.set(row.dataset.village!, row);
			row.addEventListener('click', () => onPick(row.dataset.village!));
		});
	}

	set(villages: Slice['villages'], selected: string | null, smooth: boolean) {
		const from = { ...this.shown };
		this.values = Object.fromEntries(villages.map((row) => [row.village, row.value]));
		this.max = Math.max(...villages.map((row) => row.value), 1);
		// Longest first; the order only changes when the numbers do.
		this.root.replaceChildren(...villages.map((row) => this.rows.get(row.village)!));
		villages.forEach((row) => {
			const button = this.rows.get(row.village)!;
			button.setAttribute('aria-pressed', String(selected === row.village));
			button.toggleAttribute('data-muted', !!selected && selected !== row.village);
			button.setAttribute('aria-label', `${row.village}: ${number.format(row.value)} visits. ${selected === row.village ? 'Show all villages' : 'Show only this village'}`);
		});
		if (!smooth) {
			this.shown = { ...this.values };
			this.paint();
			return;
		}
		const to = this.values;
		animate(0, 1, {
			duration: 0.5,
			ease: EASE_OUT,
			onUpdate: (t) => {
				this.shown = Object.fromEntries(Object.keys(to).map((key) => [key, lerp(from[key] ?? 0, to[key], t)]));
				this.paint();
			},
		});
	}

	progress(q: number) {
		this.q = q;
		this.paint();
	}

	private paint() {
		[...this.root.children].forEach((child, i) => {
			const row = child as HTMLElement;
			const village = row.dataset.village!;
			const grow = ease(seg(this.q, 0.3 + i * 0.05, 0.75 + i * 0.05));
			const value = this.shown[village] ?? 0;
			row.style.setProperty('--w', String((value / this.max) * grow));
			row.querySelector('[data-village-n]')!.textContent = number.format(Math.round(value * grow));
		});
	}
}

export function createDashboard(root: HTMLElement) {
	let filters: Filters = { ...DEFAULT_FILTERS };
	let q = 0;
	let live = false;
	let data = slice(filters);

	const area = new AreaChart(root.querySelector<HTMLElement>('[data-area]')!);
	const donut = new Donut(root.querySelector<HTMLElement>('[data-donut]')!);
	const bars = new VillageBars(root.querySelector<HTMLElement>('[data-villages]')!, (village) =>
		setFilters({ ...filters, village: filters.village === village ? null : village }),
	);
	const kpis = [...root.querySelectorAll<HTMLElement>('[data-kpi]')];
	const tableBody = root.querySelector<HTMLElement>('[data-rows]')!;
	const tableCount = root.querySelector<HTMLElement>('[data-table-count]')!;
	const tableScroll = root.querySelector<HTMLElement>('.table-scroll')!;
	const empty = root.querySelector<HTMLElement>('[data-empty]')!;
	const areaMeta = root.querySelector<HTMLElement>('[data-area-meta]')!;
	const clear = root.querySelector<HTMLButtonElement>('[data-clear]')!;
	let kpiShown: Record<string, number> = {};

	function kpiValues(s: Slice): Record<string, number> {
		return { people: s.people.length, visited: s.visited, due: s.status.Due, visits: s.visits };
	}

	function kpiNotes(s: Slice): Record<string, string> {
		const total = s.people.length;
		const place = filters.village ? `in ${filters.village}` : 'in 5 villages';
		const change = Math.round(s.change * 100);
		return {
			people: filters.kind ? `${filters.kind} cases ${place}` : place,
			visited: total ? `${Math.round((s.visited / total) * 100)}% of beneficiaries` : 'No beneficiaries',
			due: s.status.Due ? 'Not visited in this range' : 'Everyone has been visited',
			visits: change === 0 ? 'Same as the period before' : `${change > 0 ? '+' : '−'}${Math.abs(change)}% vs previous ${s.range.days / 7} weeks`,
		};
	}

	function paintKpis(values: Record<string, number>) {
		const grow = ease(seg(q, 0, 0.45));
		kpis.forEach((kpi) => {
			const key = kpi.dataset.kpi!;
			kpi.querySelector('[data-kpi-value]')!.textContent = number.format(Math.round((values[key] ?? 0) * grow));
			kpi.querySelector<HTMLElement>('[data-kpi-note]')!.style.opacity = String(seg(q, 0.3, 0.5));
		});
	}

	// As many rows as the card has room for, so no row is ever cut in half.
	function fit() {
		// Not pinned (reduced motion), the list is not squeezed: show a full page.
		if (!motionAllowed()) return 7;
		const room = tableScroll.clientHeight - (tableBody.parentElement!.querySelector('thead')?.offsetHeight ?? 28);
		return Math.max(1, Math.floor(room / ROW_HEIGHT));
	}

	function renderTable(s: Slice) {
		const rows = s.people.slice(0, fit());
		tableCount.textContent = `${rows.length} of ${number.format(s.people.length)}`;
		empty.hidden = rows.length > 0;
		tableBody.replaceChildren(
			...rows.map((person) => {
				const status = statusOf(person, s.range.days);
				const tr = el('tr');
				const name = el('td');
				const wrap = el('span', 'p-cell');
				wrap.append(el('span', 'p-name', person.name), el('span', 'p-place', person.village));
				if (person.merged) {
					const badge = el('span', 'p-merged', '2 merged');
					badge.title = 'Merged from the sheet and the field form';
					wrap.append(badge);
				}
				name.append(wrap);
				const last = person.visits[0];
				const visit = el('td', 'col-visit font-data', last === undefined ? '–' : longDate.format(dateOf(last)));
				const state = el('td');
				state.append(el('span', `badge badge-${STATUS_KEY[status]}`, status));
				const kind = el('td', 'col-kind', person.kind);
				const who = el('td', 'col-who');
				who.append(el('span', 'avatar', person.who));
				tr.append(name, visit, state, kind, who);
				return tr;
			}),
		);
	}

	function render(smooth: boolean) {
		data = slice(filters);
		const crossVillages = slice({ ...filters, village: null }).villages;
		const range = rangeOf(filters.range);
		areaMeta.textContent = range.bin === 'day' ? 'Per day' : 'Per week';

		const notes = kpiNotes(data);
		kpis.forEach((kpi) => (kpi.querySelector('[data-kpi-note]')!.textContent = notes[kpi.dataset.kpi!]));
		const nextKpis = kpiValues(data);
		if (smooth) {
			const from = { ...kpiShown };
			animate(0, 1, {
				duration: 0.5,
				ease: EASE_OUT,
				onUpdate: (t) => {
					kpiShown = Object.fromEntries(Object.keys(nextKpis).map((k) => [k, lerp(from[k] ?? 0, nextKpis[k], t)]));
					paintKpis(kpiShown);
				},
			});
		} else {
			kpiShown = nextKpis;
			paintKpis(kpiShown);
		}

		area.set(data, smooth);
		donut.set(data, smooth);
		bars.set(crossVillages, filters.village, smooth);
		renderTable(data);
		if (smooth) animate(tableBody, { opacity: [0.4, 1] }, { duration: 0.3 });
		syncControls();
	}

	// Filters: one menu at a time, opened from its button.
	const controls = [...root.querySelectorAll<HTMLElement>('[data-filter]')];

	function labelFor(key: string) {
		if (key === 'range') return rangeOf(filters.range).label;
		if (key === 'village') return filters.village ?? 'All villages';
		return filters.kind ?? 'All cases';
	}

	function syncControls() {
		controls.forEach((control) => {
			const key = control.dataset.filter!;
			const button = control.querySelector<HTMLButtonElement>('[data-filter-button]')!;
			const value = key === 'range' ? filters.range : key === 'village' ? filters.village : filters.kind;
			button.querySelector('[data-filter-label]')!.textContent = labelFor(key);
			button.toggleAttribute('data-on', key === 'range' ? value !== DEFAULT_FILTERS.range : value !== null);
			control.querySelectorAll<HTMLElement>('[data-value]').forEach((item) => {
				const itemValue = item.dataset.value || null;
				item.setAttribute('aria-checked', String(itemValue === value));
			});
		});
		clear.hidden = filters.range === DEFAULT_FILTERS.range && !filters.village && !filters.kind;
	}

	function setFilters(next: Filters) {
		filters = next;
		render(motionAllowed());
	}

	let open: HTMLElement | null = null;
	function closeMenu(focusButton = false) {
		if (!open) return;
		const button = open.querySelector<HTMLButtonElement>('[data-filter-button]')!;
		open.querySelector<HTMLElement>('[data-menu]')!.hidden = true;
		button.setAttribute('aria-expanded', 'false');
		if (focusButton) button.focus({ preventScroll: true });
		open = null;
	}
	function openMenu(control: HTMLElement) {
		closeMenu();
		open = control;
		const menu = control.querySelector<HTMLElement>('[data-menu]')!;
		menu.hidden = false;
		// Opens to the right of its button, or to the left when that would run off the edge.
		menu.style.left = '';
		menu.style.right = '';
		if (menu.getBoundingClientRect().right > root.getBoundingClientRect().right - 8) {
			menu.style.left = 'auto';
			menu.style.right = '0';
		}
		control.querySelector('[data-filter-button]')!.setAttribute('aria-expanded', 'true');
		const items = [...menu.querySelectorAll<HTMLElement>('[data-value]')];
		(items.find((item) => item.getAttribute('aria-checked') === 'true') ?? items[0])?.focus({ preventScroll: true });
		if (motionAllowed()) animate(menu, { opacity: [0, 1], transform: ['translateY(-4px)', 'translateY(0)'] }, { duration: 0.18, ease: EASE_OUT });
	}

	controls.forEach((control) => {
		const key = control.dataset.filter!;
		const button = control.querySelector<HTMLButtonElement>('[data-filter-button]')!;
		const menu = control.querySelector<HTMLElement>('[data-menu]')!;
		button.addEventListener('click', () => (open === control ? closeMenu() : openMenu(control)));
		menu.addEventListener('click', (event) => {
			const item = (event.target as HTMLElement).closest<HTMLElement>('[data-value]');
			if (!item) return;
			const value = item.dataset.value || null;
			if (key === 'range') setFilters({ ...filters, range: value as Filters['range'] });
			else if (key === 'village') setFilters({ ...filters, village: value });
			else setFilters({ ...filters, kind: value });
			closeMenu(true);
		});
		menu.addEventListener('keydown', (event) => {
			const items = [...menu.querySelectorAll<HTMLElement>('[data-value]')];
			const index = items.indexOf(document.activeElement as HTMLElement);
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				const step = event.key === 'ArrowDown' ? 1 : -1;
				items[(index + step + items.length) % items.length].focus({ preventScroll: true });
			} else if (event.key === 'Home' || event.key === 'End') {
				event.preventDefault();
				items[event.key === 'Home' ? 0 : items.length - 1].focus({ preventScroll: true });
			} else if (event.key === 'Escape') {
				event.preventDefault();
				closeMenu(true);
			} else if (event.key === 'Tab') closeMenu();
		});
	});
	document.addEventListener('pointerdown', (event) => {
		if (open && !open.contains(event.target as Node)) closeMenu();
	});
	clear.addEventListener('click', () => {
		setFilters({ ...DEFAULT_FILTERS });
		controls[0]?.querySelector<HTMLButtonElement>('[data-filter-button]')?.focus({ preventScroll: true });
	});
	root.querySelector('[data-empty-clear]')?.addEventListener('click', () => setFilters({ ...DEFAULT_FILTERS }));

	render(false);
	let rowsShown = tableBody.children.length;
	new ResizeObserver(() => {
		if (fit() !== rowsShown || !empty.hidden) {
			renderTable(data);
			rowsShown = tableBody.children.length;
		}
	}).observe(tableScroll);

	return {
		progress(next: number) {
			q = next;
			paintKpis(kpiShown);
			area.progress(q);
			donut.progress(q);
			bars.progress(q);
		},
		setLive(on: boolean) {
			if (on === live) return;
			live = on;
			root.inert = !on;
			root.toggleAttribute('data-live', on);
			if (!on) closeMenu();
		},
	};
}
