-- Schema for the blog's likes and comments, applied by scripts/migrate-db.mjs.
-- Every statement is IF NOT EXISTS, so re-running is a no-op.

-- Aggregate like counter, one row per post. localStorage is the only dedupe
-- (see src/components/islands/engagement/likedPosts.ts), so a per-event table
-- would store nothing this does not and would grow without bound.
CREATE TABLE IF NOT EXISTS post_likes (
  post_id    TEXT    PRIMARY KEY,
  likes      INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
) STRICT;

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id    TEXT    NOT NULL,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  body       TEXT    NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  -- Comments publish instantly, so the only moderation tool is this flag.
  -- Flip it to 1 rather than deleting, so ids stay stable:
  --   UPDATE comments SET hidden = 1 WHERE id = 42;
  hidden     INTEGER NOT NULL DEFAULT 0
) STRICT;

-- The only read path: WHERE post_id = ? AND hidden = 0 ORDER BY created_at.
CREATE INDEX IF NOT EXISTS comments_post_created ON comments (post_id, created_at);

-- Fixed-window counters for per-IP abuse control. Rows are ephemeral and
-- nothing here joins back to a comment or a like: the bucket is a salted
-- SHA-256, so no raw IP is ever stored.
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket     TEXT    PRIMARY KEY,
  hits       INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL
) STRICT;

CREATE INDEX IF NOT EXISTS rate_limits_expires ON rate_limits (expires_at);
