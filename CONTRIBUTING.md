# Contributing to Boss Mode

Thanks for your interest in improving Boss Mode! This document will help you get started.

---

## Before You Start

1. **Read the docs**:
   - [GETTING_STARTED.md](GETTING_STARTED.md) - Setup instructions
   - [CLAUDE.md](CLAUDE.md) - Project architecture and patterns
   - [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md) - Original implementation details

2. **Set up your development environment**:
   ```bash
   npm install
   cp data/nexus_state.sample.json data/nexus_state.json
   cp .env.example .env.local
   # Add your ANTHROPIC_API_KEY to .env.local
   npm run dev
   ```

3. **Test the system** manually to understand how it works

---

## Development Workflow

### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow existing patterns**:
   - Server actions in `/app/api/*`
   - Client components in `/components/*`
   - Shared logic in `/lib/*`
   - TypeScript strict mode (no `any` types)

3. **Test manually**:
   - Start dev server: `npm run dev`
   - Test your changes thoroughly
   - Check browser console for errors
   - Verify `data/nexus_state.json` updates correctly

4. **Commit your changes**:
   ```bash
   git add <files>
   git commit -m "feat: description of your feature"
   ```

### Commit Message Format

Use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests

Examples:
```
feat: add dependency graph visualization
fix: handle null deadlines in heatmap
docs: add troubleshooting section to README
perf: cache AI responses for repeated queries
```

---

## Code Quality Standards

### TypeScript

- **Strict mode enabled** - no `any` types
- Use Zod schemas for runtime validation
- Export types from component files when needed

### React

- Use **Server Components** by default
- Client components only when needed (`"use client"`)
- Follow Next.js 15 App Router patterns
- Use semantic HTML and ARIA labels

### Styling

- **Tailwind CSS** only - no custom CSS files
- Use design system colors: `blue-500`, `red-500`, etc.
- Responsive by default: `md:`, `lg:` breakpoints
- Dark mode support not yet implemented (future enhancement)

### AI Integration

- **Anthropic Claude Sonnet 4.5** for all text processing
- **OpenAI Whisper** only for audio transcription
- Always handle AI errors gracefully (try/catch)
- Log AI responses in development for debugging

---

## Common Tasks

### Adding a New Visualization

1. Create component in `/components/your-viz.tsx`
2. Add to `components/visualization-section.tsx`
3. Update `components/view-toggle.tsx` if it's a top-level view
4. Test with real data

### Modifying AI Behavior

**Extraction**: Edit `lib/ai/ingest-engine.ts` → `EXTRACTION_PROMPT`

**Chat**: Edit `lib/ai/chat-prompts.ts` → `CHAT_SYSTEM_PROMPT`

**Testing**:
1. Drop test file in `/ingest`
2. Click "Ingest Files"
3. Check console logs for AI responses
4. Verify state updates correctly

### Adding New File Types

1. Add parser to `lib/parsers/index.ts`
2. Update `extractTextFromFile()` function
3. Test with sample file of that type

### Adding API Endpoints

1. Create route in `/app/api/your-endpoint/route.ts`
2. Export `POST` or `GET` handler
3. Use Zod for request validation
4. Return `NextResponse.json()`

---

## Testing

### Manual Testing (Required)

- Test every user-facing change manually
- Check browser console for errors
- Verify state persistence works
- Test with various file types

### Playwright Tests (Future)

Test suite exists at `/tests/*.spec.ts` but hasn't been automated yet.

To run:
```bash
npm run test      # Headless
npm run test:ui   # Interactive
```

---

## Pull Request Process

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a PR** on GitHub with:
   - Clear description of what changed
   - Why the change is needed
   - Any breaking changes
   - Screenshots for UI changes

3. **PR Title Format**:
   ```
   feat: Add dependency graph visualization
   fix: Handle null deadline in project table
   ```

4. **Wait for review** - maintainers will review and provide feedback

---

## Privacy & Security

### NEVER Commit

- `/ingest/*` - Personal files
- `/audio/*` - Voice recordings
- `.env.local` - API keys
- `data/nexus_state.json` - Real project data

These are all in `.gitignore` - if you see them staged, **stop and unstage them**.

### Safe to Commit

- All code files
- `data/nexus_state.sample.json`
- `.env.example`
- Documentation
- Tests

### API Keys

- Never hardcode API keys
- Always use `process.env.*`
- Check `.env.example` for required variables

---

## Project Structure Reference

```
boss-mode/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── page.tsx           # Main dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── heatmap.tsx       # 2D visualization
│   ├── chat-panel.tsx    # AI chat
│   └── ...
├── lib/                   # Shared logic
│   ├── ai/               # AI clients and prompts
│   ├── parsers/          # File parsers
│   └── state/            # State management
├── data/                  # State storage
│   ├── nexus_state.json           # PRIVATE (gitignored)
│   └── nexus_state.sample.json    # Public template
├── ingest/               # File drop folder (gitignored)
├── tests/                # Playwright tests
├── CLAUDE.md            # Project context for Claude
├── GETTING_STARTED.md   # Setup guide
└── README.md            # Overview
```

---

## Getting Help

- **Questions**: Open a GitHub issue
- **Bugs**: Open a GitHub issue with reproduction steps
- **Feature Ideas**: Open a GitHub issue with use case description
- **Architecture Questions**: Check `CLAUDE.md` first

---

## Code of Conduct

- Be respectful and constructive
- Help others learn
- Focus on what's best for the project
- Welcome newcomers

---

## License

MIT - See [LICENSE](LICENSE) file

---

## Thank You!

Every contribution helps make Boss Mode better for executives who need strategic clarity. 🚀
