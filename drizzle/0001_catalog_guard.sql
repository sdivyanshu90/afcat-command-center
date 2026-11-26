CREATE TABLE IF NOT EXISTS content_packs (
  id TEXT PRIMARY KEY,
  imported_at INTEGER NOT NULL,
  inserted_count INTEGER NOT NULL,
  duplicate_count INTEGER NOT NULL
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS question_family_filter
  ON questions(state, subject, topic, json_extract(body, '$.family'));
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS worker_revision (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO worker_revision VALUES(1,0);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS catalog_chunks (id TEXT PRIMARY KEY);
