# Boss Mode - Claude Code Instructions

**Project Type**: Next.js 15 AI-powered executive dashboard
**Primary Language**: TypeScript, React
**AI Strategy**: Anthropic Claude Sonnet 4.5 (extraction, chat, analysis)
**Status**: Production-ready MVP with active development

---

## Project Overview

Boss Mode is a Bloomberg/Linear-quality strategic command center that transforms scattered project data (meeting notes, emails, documents) into an interactive 2D priority heatmap with AI-powered insights.

**Core Value Proposition**: Executives drop files → AI extracts projects → Visual dashboard reveals what needs attention NOW.

---

## Helping New Developers

When a developer clones this repo for the first time, guide them through:

### 1. Initial Setup Checklist

```bash
# Install dependencies
npm install

# Set up data files (IMPORTANT - prevents errors)
cp data/nexus_state.sample.json data/nexus_state.json

# Set up environment variables
cp .env.example .env.local
```

Then help them:
- Get an Anthropic API key from https://console.anthropic.com/
- Add `ANTHROPIC_API_KEY=sk-ant-...` to `.env.local`
- Optionally add `OPENAI_API_KEY=sk-proj-...` for voice memo transcription

### 2. Verify Setup

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Should see empty heatmap with instructions banner
```

### 3. Test Data Ingestion

Help them create a test file in `/ingest/test-project.md`:

```markdown
# Weekly Update

## Project Alpha
- CEO Priority: HIGH (9/10)
- Stakeholder Urgency: CRITICAL (10/10)
- Status: Blocked on infrastructure team
- Risk: $2M contract at risk if we miss Friday deadline
- Stakeholder is furious about the delay
```

Then click "Ingest Files" button and verify extraction works.

---

## Architecture Guide

### Directory Structure

```
/app
  /api
    /chat          # AI chat endpoint (inverted pyramid responses)
    /ingest        # File ingestion and AI extraction
    /quick-capture # CMD+K single-sentence updates
    /voice         # Voice memo transcription (Whisper)
    /upload        # File upload handler
  page.tsx         # Main dashboard (heatmap + chat + controls)
  layout.tsx       # Root layout with fonts

/components
  heatmap.tsx                  # 2D bivariate visualization (priority × urgency)
  chat-panel.tsx               # AI chat interface with inverted pyramid
  quick-capture-bar.tsx        # CMD+K fuzzy project matching
  project-table.tsx            # Sortable table view (8 metrics)
  project-detail-modal.tsx     # Click project → see full details
  view-toggle.tsx              # Switch: Heatmap ↔ Table
  visualization-section.tsx    # Container for views
  file-upload.tsx              # Drag-and-drop file ingestion
  instructions-banner.tsx      # Empty state guidance
  voice-recorder.tsx           # 30-sec audio recording

/lib
  /ai
    client.ts          # Anthropic SDK setup
    ingest-engine.ts   # AI extraction from files (CRITICAL)
    chat-engine.ts     # AI chat with project context
    chat-prompts.ts    # Inverted pyramid prompt engineering
  /parsers
    index.ts           # File parsers (MD, TXT, PDF, DOCX)
    audio-parser.ts    # Whisper transcription
  /state
    nexus.ts           # Zod schemas and state management
    persistence.ts     # JSON file read/write

/data
  nexus_state.json          # PRIVATE - user's real projects (gitignored)
  nexus_state.sample.json   # Public - sample data template

/ingest                     # PRIVATE - user's files (gitignored)
  .gitkeep                  # Placeholder

/tests
  *.spec.ts                 # Playwright E2E tests (not yet run)
```

---

## Key Implementation Details

### 1. AI Extraction Pipeline (CRITICAL)

**File**: `lib/ai/ingest-engine.ts`

**How it works**:
1. Read files from `/ingest` folder (supports MD, TXT, PDF, DOCX)
2. Send to Claude with structured extraction prompt
3. Parse JSON response (handles markdown code block wrapping)
4. **Upsert logic**: Merge with existing projects by name (preserve history)
5. Auto-escalation: "furious" sentiment → urgency = 8+
6. Conflict detection: Flag contradictory updates within 2-hour window

**Important**: Sequential processing (not parallel) to avoid rate limits.

### 2. Bivariate Color Scale (Heatmap)

**File**: `components/heatmap.tsx`

**Color encoding**:
- **Blue axis**: CEO Priority (0-10)
- **Red axis**: Stakeholder Urgency (0-10)
- **Purple zone**: High on both (critical projects)
- **Pulse animation**: Priority ≥7 AND Urgency ≥7

**Formula**: `rgb(urgency * 25.5, 0, priority * 25.5)`

### 3. Inverted Pyramid Chat

**File**: `lib/ai/chat-prompts.ts`

**Response structure**:
```
[One-sentence lead with most critical insight]

• [Supporting detail 1]
• [Supporting detail 2]
• [Supporting detail 3]

**Sources**: [Project names with file references]
```

Always cite specific projects and source files.

### 4. State Management

**File**: `lib/state/nexus.ts`

**Schema** (Zod):
```typescript
Project {
  id: string (UUID)
  name: string (unique identifier)
  description: string
  ceoPriority: number (0-10)
  stakeholderUrgency: number (0-10)
  stakeholderSentiment: "calm" | "concerned" | "frustrated" | "furious"
  status: "active" | "blocked" | "completed" | "archived"
  deadline?: Date
  notes?: string
  keyRisks: string[]
  dependencies: string[]
  history: ChangeEvent[] (append-only)
  sourceFile: string (filename)
  lastUpdated: Date
}
```

**Persistence**: JSON file at `data/nexus_state.json` (NEVER commit this!)

---

## Development Workflows

### Adding a New Feature

1. **Read existing code** first - understand patterns before modifying
2. **Follow existing patterns**:
   - Server actions in `/app/api/*`
   - Client components in `/components/*`
   - Shared logic in `/lib/*`
3. **TypeScript strict mode** - no `any` types
4. **Test manually** - Playwright tests exist but aren't automated yet

### Modifying AI Behavior

**Extraction**: Edit `lib/ai/ingest-engine.ts` → `EXTRACTION_PROMPT`
**Chat**: Edit `lib/ai/chat-prompts.ts` → `CHAT_SYSTEM_PROMPT`

**Testing changes**:
1. Drop a test file in `/ingest`
2. Click "Ingest Files"
3. Check console logs for AI responses
4. Verify `data/nexus_state.json` updated correctly

### Adding New File Types

1. Add parser to `lib/parsers/index.ts`
2. Update `extractTextFromFile()` with new extension
3. Test with sample file

---

## Common Tasks

### "Help me set up the project"
→ Walk through Initial Setup Checklist above, verify each step works

### "Ingest isn't working"
→ Check:
1. `ANTHROPIC_API_KEY` in `.env.local`
2. Files actually in `/ingest` folder
3. Console logs for AI errors
4. `data/nexus_state.json` exists (copy from sample if missing)

### "I want to add a new visualization"
→ Create component in `/components`, add to `visualization-section.tsx`

### "How do I deploy this?"
→ Vercel:
```bash
# Add ANTHROPIC_API_KEY to Vercel env vars
vercel deploy
```

### "Can I use a database instead of JSON?"
→ Yes! Replace `lib/state/persistence.ts` with DB calls. Schema in `nexus.ts` stays same.

---

## Data Privacy (CRITICAL)

**NEVER commit**:
- `/ingest/*` (personal meeting notes, documents)
- `/audio/*` (voice recordings)
- `.env.local` (API keys)
- `data/nexus_state.json` (extracted project data)

These are all in `.gitignore`. If someone accidentally stages them, stop the commit immediately.

**Safe to commit**:
- All code files
- `data/nexus_state.sample.json`
- `.env.example`
- Documentation

---

## Performance Considerations

### File Ingestion
- **Sequential processing** (not parallel) to avoid Claude API rate limits
- **Cache file list** to avoid O(N²) lookups
- **Large files**: DOCX meeting transcripts can be 500KB+ → expect 30-60 sec per file

### Heatmap Rendering
- Efficient with <100 projects
- Consider virtualization if >200 projects

---

## Troubleshooting

### "TypeError: Cannot read property 'projects'"
→ `data/nexus_state.json` missing or corrupted. Copy from sample.

### "Anthropic API error 401"
→ Invalid API key in `.env.local`. Get new key from console.anthropic.com

### "No projects extracted"
→ File format might not contain structured project data. Check AI prompt expectations.

### "Heatmap is empty"
→ No projects in state. Run ingestion first.

---

## Testing

**Playwright tests exist** at `/tests/*.spec.ts` but haven't been run yet.

To run:
```bash
npm run test      # Headless
npm run test:ui   # Interactive
```

---

## Future Enhancements (Ideas)

- **Cloud storage**: Integrate Google Drive, Dropbox as file sources
- **Real-time updates**: WebSocket push when files change
- **Multi-user**: User accounts, role-based access
- **Mobile app**: iOS/Android for voice memos on-the-go
- **Timeline view**: Gantt chart of project deadlines
- **Dependency graph**: Visualize project interdependencies

---

## Code Quality Standards

- **No hardcoded secrets**: Always use `process.env.*`
- **TypeScript strict**: Enable all strict checks
- **Error handling**: Always try/catch API calls
- **Accessibility**: Use semantic HTML, ARIA labels
- **Performance**: Lazy load heavy components

---

## Getting Help

- **Implementation details**: See `IMPLEMENTATION_REPORT.md`
- **Setup guide**: See `GETTING_STARTED.md`
- **API docs**: Anthropic - https://docs.anthropic.com
- **Questions**: Open GitHub issue

---

**Last Updated**: 2026-02-14
**Maintained By**: Original author + Claude Code contributors
