/**
 * Drives the likes and comments section rendered by PostEngagement.astro.
 *
 * The single GET starts as soon as the script runs, not when the reader nears
 * the end: by the time they get there the data has landed, so they never see
 * the skeleton. It costs one request for readers who never scroll down.
 */
import { track } from '../../utils/analytics';
import { cue } from '../../utils/sound';
import { type AvatarTheme, type PublicComment, fetchEngagement, likePost } from './api';
import { CommentForm, setAvatarLabel } from './CommentForm';
import { hasLiked, markLiked, readCommenter } from './likedPosts';
import { absoluteTime, relativeTime } from './timeAgo';

const AVATAR_THEMES: Record<AvatarTheme, string> = {
	gray: 'bg-surface-gray-2 text-ink-gray-5',
	blue: 'bg-surface-blue-2 text-ink-blue-7',
	green: 'bg-surface-green-2 text-ink-green-7',
	amber: 'bg-surface-amber-2 text-ink-amber-7',
	red: 'bg-surface-red-2 text-ink-red-7',
	violet: 'bg-surface-violet-2 text-ink-violet-7',
};

const LIKE_IDLE = ['bg-surface-gray-2', 'text-ink-gray-6', 'hover:bg-surface-gray-3'];
const LIKE_ACTIVE = ['bg-surface-red-2', 'text-ink-red-4'];
const HEART_IDLE = ['group-hover:text-ink-red-4'];
const HEART_ACTIVE = ['fill-current', 'motion-safe:scale-110'];

export class PostEngagement {
	private readonly postId: string;
	private readonly body: HTMLElement;
	private readonly likeButton: HTMLButtonElement;
	private likes = 0;
	private liked = false;
	private likeBusy = false;
	private comments: PublicComment[] = [];
	private list?: HTMLUListElement;
	private form?: CommentForm;

	constructor(private readonly section: HTMLElement) {
		this.postId = section.dataset.postId ?? '';
		this.body = this.find('[data-body]');
		this.likeButton = this.find('[data-like]');
	}

	start() {
		this.liked = hasLiked(this.postId);
		this.renderLike();
		this.likeButton.addEventListener('click', () => this.like());
		this.load();
	}

	private async load() {
		try {
			const engagement = await fetchEngagement(this.postId);
			this.likes = engagement.likes;
			this.comments = engagement.comments;
			this.renderLike();
			this.renderComments();
		} catch {
			this.body.replaceChildren(this.clone('error'));
		}
	}

	private async like() {
		if (this.liked || this.likeBusy) return;

		const previous = this.likes;
		// Optimistic: the heart fills before the round trip, and rolls back if
		// the server disagrees.
		this.likes += 1;
		this.liked = true;
		this.likeBusy = true;
		this.renderLike();
		cue('sparkle');

		try {
			const result = await likePost(this.postId);
			this.likes = result.likes;
			// Only after the server agrees, so a failed request never leaves this
			// browser believing it liked a post it did not.
			markLiked(this.postId);
			track('Post Like', { post: this.postId });
		} catch {
			this.likes = previous;
			this.liked = false;
			cue('error');
		} finally {
			this.likeBusy = false;
			this.renderLike();
		}
	}

	private renderLike() {
		const button = this.likeButton;
		const heart = this.find('[data-heart]');
		button.classList.remove(...(this.liked ? LIKE_IDLE : LIKE_ACTIVE));
		button.classList.add(...(this.liked ? LIKE_ACTIVE : LIKE_IDLE));
		heart.classList.remove(...(this.liked ? HEART_IDLE : HEART_ACTIVE));
		heart.classList.add(...(this.liked ? HEART_ACTIVE : HEART_IDLE));
		button.disabled = this.liked || this.likeBusy;
		button.setAttribute('aria-pressed', String(this.liked));
		button.setAttribute(
			'aria-label',
			this.liked ? `Liked, ${this.likes} in total` : `Like this post, ${this.likes} so far`,
		);
		this.find('[data-like-count]').textContent = String(this.likes);
	}

	/**
	 * A post with no comments shows a collapsed prompt instead of the form.
	 * Once there is a thread to join, the form stays open.
	 */
	private renderComments() {
		this.body.replaceChildren();
		if (!this.comments.length) return this.renderPrompt();
		this.renderList();
		this.openForm(false);
	}

	private renderList() {
		this.list = this.clone('list').firstElementChild as HTMLUListElement;
		for (const comment of this.comments) this.list.append(this.commentRow(comment));
		this.updateRails();
		this.body.prepend(this.list);
		this.updateCount();
	}

	private renderPrompt() {
		const prompt = this.clone('prompt').firstElementChild as HTMLButtonElement;
		setAvatarLabel(prompt, readCommenter().name);
		prompt.addEventListener('click', () => {
			prompt.remove();
			this.openForm(true);
		});
		this.body.append(prompt);
	}

	private openForm(autofocus: boolean) {
		this.form = new CommentForm(
			this.clone('form').firstElementChild as HTMLFormElement,
			this.postId,
			(comment) => this.onPosted(comment),
		);
		this.form.element.classList.toggle('mt-8', this.comments.length > 0);
		this.body.append(this.form.element);
		this.form.start(autofocus);
	}

	private onPosted(comment: PublicComment) {
		this.comments.push(comment);
		if (!this.list) {
			this.renderList();
		} else {
			this.list.append(this.commentRow(comment));
			this.updateRails();
			this.updateCount();
		}
		this.form?.element.classList.add('mt-8');
	}

	private commentRow(comment: PublicComment): HTMLElement {
		const row = this.clone('comment').firstElementChild as HTMLElement;
		const avatar = row.querySelector<HTMLElement>('[data-avatar]')!;
		avatar.classList.add(...AVATAR_THEMES[comment.avatarTheme].split(' '));
		avatar.textContent = comment.name[0] ?? '';

		const date = new Date(comment.createdAt * 1000);
		const time = row.querySelector<HTMLTimeElement>('[data-time]')!;
		time.dateTime = date.toISOString();
		time.textContent = relativeTime(date);
		row.querySelector('[data-time-tooltip]')!.textContent = absoluteTime(date);

		row.querySelector('[data-name]')!.textContent = comment.name;
		// Plain text, so there is nothing to sanitise.
		row.querySelector('[data-body-text]')!.textContent = comment.body;
		return row;
	}

	/** The connector line runs down from every avatar but the last. */
	private updateRails() {
		const rails = this.list?.querySelectorAll('[data-rail]') ?? [];
		rails.forEach((rail, index) => rail.classList.toggle('after:h-full', index < rails.length - 1));
	}

	private updateCount() {
		this.find('[data-count]').textContent = this.comments.length ? `(${this.comments.length})` : '';
	}

	private clone(name: string): DocumentFragment {
		const template = this.find<HTMLTemplateElement>(`template[data-template="${name}"]`);
		return template.content.cloneNode(true) as DocumentFragment;
	}

	private find<T extends HTMLElement = HTMLElement>(selector: string): T {
		return this.section.querySelector<T>(selector)!;
	}
}
