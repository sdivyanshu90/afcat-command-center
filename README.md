# AFCAT Command Center

Prepare with Precision. Aim Higher.

A local-first AFCAT 01/2027 preparation platform with a React and strict TypeScript frontend, Node HTTP API, Zod validation, and SQLite persistence. The repository contains the source, schema, original starter items, source catalogue, and verification tests.

## Start locally

Requires Node 22.13 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Practice works with a temporary guest account, which can be upgraded from **Profile** without losing progress. The default pathway is Beginner, General Awareness, 180 minutes daily for that subject. The schedule uses 60, 45, 30, 30 and 15 minute blocks.

Copy `.env.example` to `.env` to change settings. When `AFCAT_ADMIN_PASSWORD` is set to a strong password of at least 14 characters at startup, the server creates the local editor account `admin@afcat.local`. Later startups preserve the original account password. The default database path is `var/afcat.sqlite`. Keep the file and its SQLite sidecars private.

## What works

- Dashboard with actual attempts, accuracy, subject performance, streaks, recent mocks, topic recommendations and daily plans.
- Practice by subject, topic, subtopic, difficulty, pattern, and answer history. Expanded practice packs cover all four subjects. Use Mix patterns to spread a set across topics and question families, or select a specific pattern for focused repetition. Options are shuffled and explanations reference source material.
- A 100-question mock with the official 120-minute countdown and +3/−1/0 raw marking. The versioned practice split starts at 30 General Awareness, 25 English, 20 Numerical and 25 Reasoning. The notification specifies the overall format and gives no fixed subject split. On-screen and server checks enforce the deadline. Each attempt pins the question versions and shuffled options.
- Results with raw scores, accuracy, attempt rate, measured response time, score history and review by subject, topic and difficulty. Missed answers schedule recall after one day. Successful recalls advance through three, seven, fourteen and thirty days.
- A cycle-aware source archive from 01/2011 through 02/2026, two official model references, and support for permission-documented historical imports. The two annual cycles are searchable independently.
- Source-linked current-affairs notes with event, publication and verification dates. Recurring challenges use the live bank and report inventory shortages.
- Optional OpenAI Responses API tutoring using the question, chosen option and published explanation. Published study guidance works without a key. Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` to enable enhanced answers. Students can turn the provider off per request. Provider requests contain the question and selected option and exclude account details.
- Editor inventory, versioned question editing, CSV/JSON imports, duplicate detection, review transitions, report resolution, current-affairs publishing, and versioned mock split approval.

## Examination and source policy

The exam is scheduled for 31 January 2027. Section 8 of the cycle notification confirms English, 100 questions and 120 minutes. Numerical Ability is at matriculation level and other subjects at graduation level. Clocks appear in the older IAF syllabus and are tagged as supporting practice. The full mock excludes clocks.

- [AFCAT 01/2027 notice](https://careerairforce.gov.in/sites/default/files/2026-11/Notification-for-AFCAT-2027.pdf)
- [IAF syllabus page](https://www.careerairforce.gov.in/afcat-syllabus)
- [IAF model papers and answer keys](https://www.careerairforce.gov.in/afcat-model-questions)
- [IAF guidance on access to exam papers](https://www.careerairforce.gov.in/afcat-examination)
- [AFCAT 02/2026 notice documenting timed candidate access](https://www.careerairforce.gov.in/sites/default/files/inline-files/AFCAT-Cycle-02-2026-Notification.pdf)

The archive records 46 third-party references across 32 cycle labels, three official notices about historical access, and two official model papers. The earliest documented sitting is 27 March 2011. Third-party answer links reflect publisher materials. The IAF notices describe candidate access restrictions. The seed contains zero authenticated previous-year questions cleared for republication. No third-party question text was imported. The exam-analysis panel classifies all 200 numbered model items and gives separate observations from four third-party samples. These samples describe the documents inspected and cannot establish topic frequencies across actual AFCAT sittings.

The curriculum maps topics and objectives to the current syllabus. Preparation priority reflects syllabus alignment and prerequisite value. Current-affairs notes are editor-maintained. The packs pair original factual and language material with authored, repeatable methods for arithmetic and reasoning. Imported practice uses automated structure, duplicate and coverage checks. Independent educator sign-off and full lesson material remain pending.

## Practice bank design

The full subject counts are queried from published question records. The shipped bank contains 17,083 items, with 4,381 General Awareness, 4,470 English, 4,155 Numerical Ability, and 4,077 Reasoning and Military Aptitude questions. Versions of a template count as separate questions when they have distinct prompts and require the learner to work with new inputs. The packs carry a pattern tag so students can practise that method deliberately. The bank includes direct knowledge checks, reverse retrieval, comparison and error correction for General Awareness, original vocabulary and grammar exercises for English, parameterised numerical problems with worked solutions, and verbal and visual reasoning scenarios.

The original model documents inform practice formats. Historical paper text stays with its sources unless verified publication permission is recorded. The bank makes no frequency or prediction claim about past or upcoming AFCAT papers.

For a mixed practice session or mock the server spreads early selections across topics and question patterns. It prefers unseen questions within each pattern and spreads variants built around the same lead fact before returning to that fact. Focused drills keep the selected pattern and can exclude attempted questions. In a full mock, study-note correction and reverse fact lookup are excluded in favour of shorter General Awareness exam-style formats.

Each checked-in content pack has a stable version and imports transactionally on first startup, including into existing databases. Existing question revisions and student results remain available. A migration ledger records imported and duplicate counts. To update a shipped pack, add a new pack ID and use the editorial version workflow for corrections to published records.

## Editorial workflow

The editor can import up to 500 items and 5 MB per API request. JSON is an array of question objects. CSV uses corresponding headers, with `optionA`, `optionB`, `optionC`, `optionD` in place of the array. The correct index is zero-based.

```json
{
  "subject": "num",
  "topic": "Averages and Percentages",
  "subtopic": "Percentage Change",
  "prompt": "A tank holds 80 litres. Its contents increase by 15%. How many litres does it now hold?",
  "options": ["92", "95", "68", "104"],
  "answer": 0,
  "explanation": "Fifteen percent of 80 is 12. Adding 12 to 80 gives 92 litres.",
  "difficulty": "Easy",
  "source": "https://www.careerairforce.gov.in/afcat-syllabus",
  "classification": "ORIGINAL_AFCAT_STYLE"
}
```

The six supported source classifications are `OFFICIAL_PREVIOUS_YEAR`, `OFFICIAL_MODEL`, `LICENSED_PREVIOUS_YEAR`, `MEMORY_BASED_RECONSTRUCTION`, `ORIGINAL_AFCAT_STYLE`, and `TREND_INFORMED_PRACTICE`. Historical imports require `year`, `cycle` and a documented `permission` entry. For a historical paper use the same canonical source reference across its rows, and supply `number` for order. Models also require permission. Use `reviewBy` to automatically retire time-sensitive questions from eligible pools and `verifiedOn` to record the most recent check.

Move drafts through **validated → review → verified → published**. A verification rationale is mandatory. A rejected question can be returned to draft. Editing creates an unpublished draft version, with older versions retained by existing sessions. Normalized duplicate prompts are rejected. The Similar action gives a lexical comparison within the topic for editorial triage. The local arithmetic generator creates drafts in three objectives. Broad automated generation, semantic embeddings, a licensed acquisition feed, and measurement of historical frequency remain future work.

## Verify and deploy

```sh
npm run typecheck
npm test
npm run test:content
npm run build
npm start
```

Optional Chromium flow tests use Python Playwright. Install the `playwright` Python package and run `playwright install chromium`. With the application running, run `python3 tests/browser.py`. Browser and server must use the same origin. Tests use a new student account and write sample progress, so run against a test database.

Run production with a persistent local volume and an HTTPS reverse proxy. Set `APP_ORIGIN` to the exact public origin, including its scheme, and only forward traffic for that host. Cookies are marked Secure under an HTTPS origin. The Dockerfile builds a single Node service.

```sh
docker build -t afcat-command-center .
docker run --name afcat-command-center -p 127.0.0.1:5173:5173 \
  -e APP_ORIGIN=https://afcat.example.org \
  -v afcat-data:/app/var afcat-command-center
```

For backups, use SQLite's online backup facility or stop the server and copy the database and remaining sidecars together. Keep backups access-controlled and test restore before promoting changes. The startup script applies the idempotent schema in `migrations/`. Create subsequent migrations explicitly when the schema changes. Register the initial administrator with the password provided through the host secret manager.

SQLite filtering and session writes stay server-side. Bucket indexes, paginated editorial queries, immutable question snapshots and short transactions suit a single-host launch. PostgreSQL, external identity, row-level security, independent security auditing and multi-instance load testing remain deployment milestones. Email verification, account recovery, a comprehensive flashcard bank and provider-backed question generation are outside this release. Analytics reflect the actual workload and make no ranking or qualification claims.

### Managed Docker hosting

The service uses `PORT` from the hosting platform and serves `GET /healthz` after the database and question packs initialize. It recognizes `RENDER_EXTERNAL_URL` and `RAILWAY_PUBLIC_DOMAIN` as the public origin. Set `APP_ORIGIN` explicitly when using a custom domain.

- **Render** supports the included `render.yaml` Blueprint. It provisions one Docker web service with a paid persistent disk mounted at `/app/var`.
- **Railway** can build directly from the Dockerfile. Use one replica, mount a persistent volume at `/app/var`, set the health check to `/healthz`, and generate an HTTPS domain.

Ensure the persistent volume is writable by the container's `node` user (UID 1000). A fresh volume initializes the built-in question packs. Restore a consistent SQLite backup to the volume before startup if you intend to transfer existing accounts and attempts.

### ChatGPT Sites

The Sites build uses a Cloudflare Worker and a D1 binding named `DB`. The build embeds the frontend and compressed published seed packs. Dashboard requests install new catalogue chunks in retryable batches. Successive packs retain prior chunk boundaries and question IDs, preserving saved attempts. Each deployed Site has its own accounts and exam progress.

```sh
npm run build:sites
npm run test:sites
```

Ship the checked-in D1 schema in `drizzle/` with the Worker. The local integration test exercises the D1 adapter contract using SQLite, including catalogue setup, concurrent answers, expiry, scoring, and the editorial import. Keep any editor password or optional AI key in the hosting environment. On Sites, an editor can sign in at `admin@afcat.local` after setting `AFCAT_ADMIN_PASSWORD`.
