# CEO Strategic Nexus

A Bloomberg/Linear-quality strategic command center that synthesizes scattered project data into a 2D visualization with AI-powered insights.

## Features

- **2D Priority Heatmap**: Bivariate visualization of CEO Priority vs. Stakeholder Urgency
- **AI Data Extraction**: Automatic project extraction from markdown, text, PDF, DOCX files
- **Strategic Chat**: Natural language queries about projects, risks, and priorities
- **Zero-Friction Capture**:
  - Voice memos (30-sec recordings)
  - Email forwarding
  - CMD+K quick capture
- **Conflict Detection**: Auto-flags contradictory data updates
- **Change History**: AI-generated summaries of all project changes

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Add your Anthropic API key and OpenAI API key
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open dashboard**:
   Navigate to [http://localhost:3000](http://localhost:3000)

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

### Strategic Chat
1. Ask questions like "What are my highest risk projects?"
2. Chat uses inverted pyramid format (lead sentence, bullets, sources)
3. References specific projects and source files

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
