CREATE TABLE IF NOT EXISTS content_packs (
  id TEXT PRIMARY KEY,
  imported_at INTEGER NOT NULL,
  inserted_count INTEGER NOT NULL,
  duplicate_count INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS question_family_filter
  ON questions(state, subject, topic, json_extract(body, '$.family'));
