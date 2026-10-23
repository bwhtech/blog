/** The comment form, cloned from its <template> in PostEngagement.astro. */
import { track } from '../../utils/analytics';
import { cue } from '../../utils/sound';
import { type FieldErrors, type PublicComment, fieldErrorsOf, messageOf, postComment } from './api';
import { readCommenter, saveCommenter } from './likedPosts';

const BODY_MAX = 2000;
const FIELDS = ['name', 'email', 'body'] as const;

export class CommentForm {
	private readonly name: HTMLInputElement;
	private readonly email: HTMLInputElement;
	private readonly body: HTMLTextAreaElement;
	private readonly honeypot: HTMLInputElement;
	private readonly submitButton: HTMLButtonElement;
	private submitting = false;
	private posted = false;
	/** Lets the server reject a form submitted faster than a person could read it. */
	private shownAt = 0;

	constructor(
		readonly element: HTMLFormElement,
		private readonly postId: string,
		private readonly onPosted: (comment: PublicComment) => void,
	) {
		const fields = element.elements;
		this.name = fields.namedItem('name') as HTMLInputElement;
		this.email = fields.namedItem('email') as HTMLInputElement;
		this.body = fields.namedItem('body') as HTMLTextAreaElement;
		this.honeypot = fields.namedItem('hp_url') as HTMLInputElement;
		this.submitButton = element.querySelector('button[type="submit"]')!;
	}

	/** Call once the form is in the document, so focus can land in it. */
	start(autofocus: boolean) {
		this.shownAt = performance.now();
		const remembered = readCommenter();
		this.name.value = remembered.name;
		this.email.value = remembered.email;
		this.renderHeading();

		this.name.addEventListener('input', () => this.renderHeading());
		this.body.addEventListener('input', () => this.renderStatus());
		this.element.addEventListener('submit', (event) => {
			event.preventDefault();
			this.submit();
		});

		// Opened from the collapsed prompt, so the click was intent to write.
		// Land on the first field still to fill.
		if (autofocus) (this.name.value && this.email.value ? this.body : this.name).focus();
	}

	private async submit() {
		if (this.submitting) return;
		this.setSubmitting(true);
		this.showErrors({}, '');

		try {
			const comment = await postComment({
				postId: this.postId,
				name: this.name.value,
				email: this.email.value,
				body: this.body.value,
				hp_url: this.honeypot.value,
				elapsedMs: Math.round(performance.now() - this.shownAt),
			});

			this.onPosted(comment);
			saveCommenter({ name: this.name.value, email: this.email.value });
			this.body.value = '';
			this.posted = true;
			this.shownAt = performance.now();
			this.renderStatus();
			cue('success');
			track('Comment Posted', { post: this.postId });
		} catch (error) {
			const fields = fieldErrorsOf(error);
			this.showErrors(fields ?? {}, fields ? '' : messageOf(error));
			cue('error');
		} finally {
			this.setSubmitting(false);
		}
	}

	private renderHeading() {
		setAvatarLabel(this.element, this.name.value);
		this.element.querySelector('[data-heading]')!.textContent = this.name.value || 'Leave a comment';
	}

	private renderStatus() {
		const remaining = BODY_MAX - this.body.value.length;
		let status = '';
		if (this.posted && !this.body.value) status = 'Thanks, your comment is live.';
		else if (remaining < 200) status = `${remaining} characters left`;
		this.element.querySelector('[data-status]')!.textContent = status;
	}

	/** Like frappe-ui's FormControl, a field error replaces the field's description. */
	private showErrors(fields: FieldErrors, formError: string) {
		for (const field of FIELDS) {
			const control = this.element.querySelector<HTMLElement>(`#comment-${field}`)!;
			const error = this.element.querySelector<HTMLElement>(`#comment-${field}-error`)!;
			const description = this.element.querySelector<HTMLElement>(`#comment-${field}-description`);
			const message = fields[field] ?? '';

			error.textContent = message;
			error.hidden = !message;
			if (description) description.hidden = Boolean(message);
			if (message) control.setAttribute('aria-invalid', 'true');
			else control.removeAttribute('aria-invalid');
			const describedBy = message ? error.id : description?.id;
			if (describedBy) control.setAttribute('aria-describedby', describedBy);
			else control.removeAttribute('aria-describedby');
		}

		const formErrorElement = this.element.querySelector<HTMLElement>('[data-form-error]')!;
		formErrorElement.textContent = formError;
		formErrorElement.hidden = !formError;
	}

	/** Like frappe-ui's Button: a spinner in front of the label, and no hover while busy. */
	private setSubmitting(submitting: boolean) {
		this.submitting = submitting;
		this.submitButton.disabled = submitting;
		this.submitButton.classList.toggle('pointer-events-none', submitting);
		if (submitting) this.submitButton.setAttribute('aria-busy', 'true');
		else this.submitButton.removeAttribute('aria-busy');
		this.submitButton.querySelector<SVGElement>('[data-spinner]')!.toggleAttribute('hidden', !submitting);
	}
}

/** The avatar shows the first letter of a name, or a speech bubble until there is one. */
export function setAvatarLabel(root: HTMLElement, name: string) {
	const initial = root.querySelector<HTMLElement>('[data-initial]')!;
	initial.textContent = name.trim()[0] ?? '';
	root.querySelector<HTMLElement>('[data-icon]')!.hidden = Boolean(name.trim());
}
