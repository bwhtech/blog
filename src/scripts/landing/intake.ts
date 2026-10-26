/**
 * The "Tell us the problem" form. Front end only for now: it tracks which
 * problems are picked and shows a thank-you state. Nothing leaves the page.
 *
 * Inputs may sit outside the <form> element and join it through the `form`
 * attribute, so everything reads through `form.elements`, never querySelector.
 */
export function pickedProblems(form: HTMLFormElement): string[] {
	return [...form.elements]
		.filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && el.name === 'problem')
		.filter((input) => input.checked)
		.map((input) => input.value);
}

export function initIntake(form: HTMLFormElement, onChange?: (picked: string[]) => void) {
	const body = form.querySelector<HTMLElement>('[data-intake-body]');
	const done = form.querySelector<HTMLElement>('[data-intake-done]');

	// `change` from an input outside the form does not bubble to the form.
	document.addEventListener('change', (event) => {
		const input = event.target;
		if (!(input instanceof HTMLInputElement) || input.form !== form || input.name !== 'problem') return;
		onChange?.(pickedProblems(form));
	});

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (!form.reportValidity()) return;

		const data = new FormData(form);
		const name = String(data.get('name') ?? '').trim();
		const contact = String(data.get('contact') ?? '').trim();
		const labels = pickedProblems(form).map(
			(id) => document.querySelector<HTMLElement>(`[data-problem-label="${id}"]`)?.textContent?.trim() ?? id,
		);

		if (done) {
			const greeting = done.querySelector('[data-intake-greeting]');
			const list = done.querySelector('[data-intake-list]');
			const reply = done.querySelector('[data-intake-contact]');
			if (greeting) greeting.textContent = name ? `Thanks, ${name}.` : 'Thanks.';
			if (reply) reply.textContent = contact;
			if (list) {
				list.replaceChildren(
					...(labels.length ? labels : ['The problem in your words']).map((label) => {
						const item = document.createElement('li');
						item.textContent = label;
						return item;
					}),
				);
			}
			body?.setAttribute('hidden', '');
			done.removeAttribute('hidden');
			done.focus();
		}
		form.dispatchEvent(new CustomEvent('intake:sent', { detail: { labels } }));
	});

	form.querySelector('[data-intake-reset]')?.addEventListener('click', () => {
		form.reset();
		done?.setAttribute('hidden', '');
		body?.removeAttribute('hidden');
		onChange?.([]);
		form.querySelector<HTMLElement>('input, textarea')?.focus();
	});
}
