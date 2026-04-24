# Legalaxy

Legal concept knowledge graph — hierarchical WordNet for law. Data lives in Google Sheets, frontend on GitHub Pages, no server.

## Setup

### 1. Google Sheet

Open the sheet and create three tabs named exactly: **Nodes**, **Edges**, **Log**

Paste these headers into row 1 of each tab:

**Nodes:**
```
id	label	layer	parent_id	definition	citation	authority_level	jurisdiction	temporal_valid_from	temporal_valid_to	notes
```

**Edges:**
```
id	from_id	to_id	relationship_type	citation	jurisdiction	strength	temporal_valid_from	temporal_valid_to	notes
```

**Log:**
```
timestamp	action	node_or_edge	id	user_note
```

### 2. Apps Script

1. In the Sheet, go to **Extensions > Apps Script**
2. Delete any existing code and paste the contents of `Code.gs`
3. Click **Deploy > New deployment**
4. Type: **Web app**
5. Execute as: **Me**
6. Who has access: **Anyone**
7. Click **Deploy**, authorize when prompted, copy the deployment URL

### 3. Frontend

In `index.html`, replace line:
```js
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL';
```
with your deployment URL.

Commit `index.html` to the root of the `nicholasdhaliwal/legalaxy` GitHub repo. GitHub Pages will serve it at `nicholasdhaliwal.github.io/legalaxy`.

### 4. Seed data

Install node-fetch if needed:
```bash
npm install node-fetch
```

Run the seed script:
```bash
node seed.js YOUR_APPS_SCRIPT_URL
```

This populates 60 nodes (1 root, 7 domain, 52 subdomain) and their edges. Takes about 2-3 minutes due to Apps Script rate limits.

### 5. Visit the app

`https://nicholasdhaliwal.github.io/legalaxy`

---

## Sheet ID

`1_HCRVLnd02aj_VzHHFJCEC69cmXh77NIcpZi5VhT3IY`

## Edge relationship_type taxonomy

```
legal-hypernym | legal-hyponym | element-of | defined-as
establishes | applies | modifies | overrules | distinguishes
requires | triggers | bars | conflicts-with | exception-to
proven-by | rebutted-by | inferred-from | entitles-to | limits
```

## File structure

```
legalaxy/
├── index.html    — full frontend (single file, no build step)
├── seed.js       — one-time seeding script (Node.js)
├── Code.gs       — Google Apps Script (paste into Apps Script editor)
└── README.md
```
