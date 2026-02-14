# Boss Mode

A Bloomberg/Linear-quality AI-powered executive dashboard that synthesizes scattered project data into a 2D visualization with strategic insights.

**→ New here? Start with [GETTING_STARTED.md](GETTING_STARTED.md) for step-by-step setup instructions.**

**→ Using Claude Code? See [CLAUDE.md](CLAUDE.md) for comprehensive development context.**

## Features

- **2D Priority Heatmap**: Bivariate visualization of CEO Priority vs. Stakeholder Urgency
- **AI Data Extraction**: Automatic project extraction from markdown, text, PDF, DOCX files
- **AI Chat**: Natural language queries about projects, risks, and priorities
- **Zero-Friction Capture**:
  - Voice memos (30-sec recordings)
  - Email forwarding
  - CMD+K quick capture
- **Conflict Detection**: Auto-flags contradictory data updates
- **Change History**: AI-generated summaries of all project changes

## Quick Start

**For detailed setup instructions, see [GETTING_STARTED.md](GETTING_STARTED.md)**

### 5-Minute Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up data files
cp data/nexus_state.sample.json data/nexus_state.json

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# 4. Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and click "Ingest Files" to process sample data.

## Data Privacy

**Important**: Boss Mode keeps your data private by default.

### What's Protected
- **Meeting transcripts** (`/ingest/*`) - Never committed to git
- **Audio recordings** (`/audio/*`) - Never committed to git
- **API keys** (`.env.local`) - Never committed to git
- **Extracted projects** (`data/nexus_state.json`) - Never committed to git

### First-Time Setup
1. Copy the sample state file:
   ```bash
   cp data/nexus_state.sample.json data/nexus_state.json
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

3. Add your API keys to `.env.local`:
   - Get Anthropic key: https://console.anthropic.com/
   - Get OpenAI key (optional): https://platform.openai.com/

4. Drop your files in `/ingest` folder and click "Ingest Files"

### What's Safe to Share
- All code files (no hardcoded secrets)
- Configuration templates (`.env.example`, `nexus_state.sample.json`)
- Documentation and tests

**Never commit**: Real API keys, personal meeting notes, or extracted project data.

## Usage

### File Ingestion
1. Drop markdown/text/PDF/DOCX files in the `/ingest` folder
2. Click "Ingest Files" button in the dashboard
3. AI extracts projects and updates the heatmap

### Voice Memos
1. Click "Voice Memo" button
2. Record up to 30 seconds
3. Audio is transcribed and mapped to relevant projects

### Quick Capture (CMD+K)
1. Press ⌘K anywhere in the dashboard
2. Type a single sentence (e.g., "Project X is now top priority")
3. AI fuzzy-matches the project and updates state

### AI Chat
1. Ask questions like "What are my highest risk projects?"
2. Chat uses inverted pyramid format (lead sentence, bullets, sources)
3. References specific projects and source files

## Documentation

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Step-by-step setup guide for new developers
- **[CLAUDE.md](CLAUDE.md)** - Comprehensive project context for Claude Code
- **[IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md)** - Original implementation quality report
- **[.env.example](.env.example)** - Environment variable template

## Testing

Run the Playwright test suite:

```bash
npm run test
```

Run tests in UI mode:

```bash
npm run test:ui
```

## Architecture

- **Framework**: Next.js 15 (App Router)
- **AI**: Anthropic Claude Sonnet 4.5 (primary), OpenAI Whisper (audio transcription)
- **UI**: Tailwind CSS, Shadcn/UI, Lucide Icons
- **Testing**: Playwright

## Project Structure

```
/app              # Next.js app router
/components       # React components
/lib
  /ai             # AI clients, prompts, services
  /parsers        # File and audio parsers
  /state          # State management
/data             # nexus_state.json storage
/ingest           # Drop files here for ingestion
/audio            # Temporary audio file storage
/tests            # Playwright test suite
```

## Environment Variables

Required:
- `ANTHROPIC_API_KEY`: Claude API key (primary AI)
- `OPENAI_API_KEY`: OpenAI key (Whisper transcription only)

Optional:
- `NEXUS_EMAIL`: Email forwarding address
- `EMAIL_WEBHOOK_SECRET`: Webhook secret for email ingestion

## License

MIT
