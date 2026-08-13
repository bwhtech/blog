/**
 * Renders one Open Graph image per author into public/og/author/<id>.jpg.
 *
 * The images are committed, so this only has to run when an author's name,
 * role, bio, or photo changes:
 *
 *   npm run generate-og:author            # every author
 *   npm run generate-og:author -- <id>    # one author
 */
import fs from 'node:fs';
import path from 'node:path';

import { parse as parseYaml } from 'yaml';

import { buildDocument, escapeHtml, renderCards, root, toDataUri } from './og-card.mjs';

const authorsFile = path.join(root, 'src/data/authors.yaml');
const outDir = path.join(root, 'public/og/author');

/** Only the first paragraph fits, and a long one is cut at a word boundary. */
function firstLine(bio) {
	if (!bio) return '';

	const paragraph = bio.split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();

	if (paragraph.length <= 110) return paragraph;

	return `${paragraph.slice(0, 110).replace(/\s+\S*$/, '')}…`;
}

function buildHtml(author) {
	const avatar = toDataUri(path.join(root, 'public', author.avatar));
	const bio = firstLine(author.bio);

	const css = `
	.author {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 56px;
		position: relative;
		z-index: 1;
	}

	.avatar {
		width: 300px;
		height: 300px;
		flex: none;
		border-radius: 50%;
		object-fit: cover;
		border: 4px solid #292929;
	}

	.role {
		font-size: 22px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #999999;
	}

	h1 {
		font-size: ${author.name.length > 18 ? 60 : 72}px;
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.05;
	}

	.role + h1 { margin-top: 10px; }

	.bio {
		margin-top: 20px;
		font-size: 28px;
		line-height: 1.4;
		color: #afafaf;
	}
`;

	const body = `	<div class="author">
		<img class="avatar" src="${avatar}" />
		<div>
			${author.role ? `<div class="role">${escapeHtml(author.role)}</div>` : ''}
			<h1>${escapeHtml(author.name)}</h1>
			${bio ? `<div class="bio">${escapeHtml(bio)}</div>` : ''}
		</div>
	</div>`;

	return buildDocument({ css, body });
}

const authors = parseYaml(fs.readFileSync(authorsFile, 'utf-8'));
const wanted = process.argv[2];
const targets = wanted ? authors.filter((author) => author.id === wanted) : authors;

if (!targets.length) {
	console.error(wanted ? `No author with id "${wanted}"` : 'No authors found');
	process.exit(1);
}

await renderCards(
	targets.map((author) => ({
		label: author.id,
		html: buildHtml(author),
		outFile: path.join(outDir, `${author.id}.jpg`),
	})),
);
