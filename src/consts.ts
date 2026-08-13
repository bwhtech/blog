export const SITE_TITLE = 'BWH';
export const SITE_DESCRIPTION =
	'Ideas, experiments, and practical lessons from building useful software.';

/**
 * Every post lives in `src/content/blog/<category>/<slug>/`, and that folder
 * name is the first segment of the post URL. Adding a category means adding a
 * folder and an entry here.
 */
export const CATEGORIES = {
	announcements: 'Announcements',
	engineering: 'Engineering',
	stories: 'Stories',
	thoughts: 'Thoughts',
	'tips-and-tricks': 'Tips & Tricks',
	tutorial: 'Tutorial',
} as const;

export type CategorySlug = keyof typeof CATEGORIES;
