# Getting Started with Boss Mode

Welcome! This guide will walk you through setting up Boss Mode on your local machine and getting your first projects visualized.

---

## Prerequisites

- **Node.js** 18.x or later ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Anthropic API key** (required) - [Get one free](https://console.anthropic.com/)
- **OpenAI API key** (optional) - Only needed for voice memos ([Get key](https://platform.openai.com/))

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/kasazen/boss-mode.git
cd boss-mode
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This will install:
- Next.js 15 (React framework)
- Anthropic SDK (Claude AI)
- File parsers (PDF, DOCX, Markdown)
- UI components and styling

**Expected time**: 1-2 minutes

---

## Step 3: Set Up Data Files

⚠️ **IMPORTANT**: The repository doesn't include real project data (for privacy). You need to create your own:

```bash
# Copy sample state file to create your empty project database
cp data/nexus_state.sample.json data/nexus_state.json
```

**What this does**: Creates a local JSON file where your projects will be stored. This file is `.gitignore`d so your data stays private.

---

## Step 4: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Now open `.env.local` in your editor and add your API keys:

```bash
# REQUIRED: Get this from https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE

# OPTIONAL: Only needed for voice memo transcription
# Get from https://platform.openai.com/
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

### Getting Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys" in the dashboard
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)
6. Paste it into `.env.local`

**Free tier**: Anthropic offers free credits to start. You'll need to add payment info for continued use.

---

## Step 5: Start the Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.3s
```

---

## Step 6: Open the Dashboard

Open your browser and navigate to:

**http://localhost:3000**

You should see:
- Empty heatmap visualization
- "Get Started" instructions banner
- Chat panel on the right
- "Ingest Files" button in the header

---

## Step 7: Ingest Your First Project

Let's create a sample project file to test the AI extraction.

### Option A: Create a Markdown File (Easiest)

1. Create a file: `ingest/my-first-project.md`

2. Add this content:

```markdown
# Weekly Executive Update

## Project Phoenix

Our flagship enterprise client initiative is running into serious delays. The stakeholder is extremely frustrated about missing the original deadline.

- **Priority**: This is my absolute top priority (10/10)
- **Urgency**: Client is threatening to cancel the contract (10/10)
- **Deadline**: Friday, February 21st
- **Status**: Blocked on infrastructure team approval
- **Key Risk**: $3M annual contract at risk if we don't deliver this week

## Project Website Redesign

Routine website refresh with our marketing team.

- **Priority**: Medium importance (4/10)
- **Urgency**: No rush, can wait until next quarter (2/10)
- **Status**: In progress, design phase
- **Stakeholder**: Marketing VP is calm and patient
```

3. Go to the dashboard (http://localhost:3000)

4. Click the **"Ingest Files"** button in the top navigation

5. Wait ~10-20 seconds for AI extraction

6. Watch the heatmap populate with your projects!

### Option B: Use the Upload UI

1. Click "Upload Files" tab in the dashboard
2. Drag and drop any markdown, text, PDF, or DOCX file
3. Supported formats:
   - `.md` - Markdown files
   - `.txt` - Plain text
   - `.pdf` - PDF documents
   - `.docx` - Word documents

---

## Step 8: Explore the Features

### View Your Projects

**Heatmap View** (default):
- X-axis = CEO Priority (0-10)
- Y-axis = Stakeholder Urgency (0-10)
- Color = Blue (priority) + Red (urgency) = Purple (critical)
- Hover over circles to see project names
- Click a circle to see full details

**Table View**:
- Click "Table" toggle in top-right
- Sort by any column (priority, urgency, deadline, etc.)
- Click row to see full details

### Try the AI Chat

Click the chat panel on the right and ask:

- "What are my highest risk projects?"
- "Which projects need immediate attention?"
- "Show me all blocked projects"
- "What's the status of Project Phoenix?"

The AI will respond in **inverted pyramid format**:
1. Lead sentence (most critical insight)
2. Supporting bullet points
3. Source citations

### Use Quick Capture (CMD+K)

Press **⌘K** (Mac) or **Ctrl+K** (Windows/Linux) and type:

- "Project Phoenix is now unblocked"
- "Website redesign urgency increased to 8"
- "Marketing VP sentiment is now frustrated"

The AI will fuzzy-match your project and update the state.

### Record a Voice Memo (Optional)

⚠️ Requires `OPENAI_API_KEY` in `.env.local`

1. Click "Voice Memo" button
2. Record up to 30 seconds
3. AI transcribes with Whisper
4. Extracts project updates from your spoken words

---

## Step 9: Understanding Your Data

All your projects are stored in:

```
data/nexus_state.json
```

**IMPORTANT**:
- ✅ This file is `.gitignore`d - your data stays private
- ✅ Safe to edit manually if needed (it's just JSON)
- ⚠️ Don't delete this file - it's your project database
- ⚠️ Consider backing it up regularly

**Sample structure**:

```json
{
  "version": "1.0",
  "projects": [
    {
      "id": "uuid-here",
      "name": "Project Phoenix",
      "ceoPriority": 10,
      "stakeholderUrgency": 10,
      "status": "blocked",
      ...
    }
  ],
  "metadata": {
    "lastIngestion": "2026-02-14T...",
    "totalFilesProcessed": 1
  }
}
```

---

## Troubleshooting

### "Cannot find module" errors

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "ANTHROPIC_API_KEY is not defined"

Make sure you:
1. Created `.env.local` (not `.env`)
2. Added the key correctly (no quotes, no spaces)
3. Restarted the dev server after adding the key

### Ingestion returns no projects

Check:
1. Your file is in the `/ingest` folder
2. The file contains actual project information
3. Console logs (F12 → Console tab) for AI errors
4. Your API key is valid and has credits

### Heatmap is empty after ingestion

1. Check browser console for errors
2. Verify `data/nexus_state.json` has projects
3. Refresh the page
4. Check if projects have priority/urgency values

### Voice memos don't work

Voice transcription requires `OPENAI_API_KEY`. If you don't need this feature, it's optional.

---

## Next Steps

### Add Your Own Projects

1. Drop your meeting notes, project docs, or emails into `/ingest`
2. Click "Ingest Files"
3. Review extracted projects for accuracy
4. Use Quick Capture (CMD+K) for quick updates

### Customize the System

- **AI Prompts**: Edit `lib/ai/chat-prompts.ts` and `lib/ai/ingest-engine.ts`
- **Visualization**: Modify `components/heatmap.tsx`
- **Add Features**: Follow patterns in existing components

### Deploy to Production

See [README.md](README.md) for Vercel deployment instructions.

---

## Common Questions

**Q: Is my data private?**
A: Yes! All your files and extracted data stay local. The `.gitignore` prevents accidental commits.

**Q: What file formats are supported?**
A: Markdown (.md), plain text (.txt), PDF (.pdf), and Word documents (.docx)

**Q: Can I use a database instead of JSON?**
A: Yes! Replace `lib/state/persistence.ts` with your database logic. The Zod schema stays the same.

**Q: How much does this cost?**
A: Anthropic charges ~$0.003 per file ingestion (depends on file size). Voice memos cost ~$0.006/minute via OpenAI.

**Q: Can multiple people use this?**
A: Currently single-user. Multi-user would require user accounts and a database.

---

## Getting Help

- **Technical issues**: Check `CLAUDE.md` for architecture details
- **Implementation details**: See `IMPLEMENTATION_REPORT.md`
- **Questions**: Open a GitHub issue

---

## Welcome Aboard! 🚀

You're now ready to transform your scattered project data into strategic clarity.

**Pro tip**: Start with a few sample files to test the system, then gradually add your real project documentation. The AI gets better at extraction as you refine your input format.

**Recommended workflow**:
1. Drop weekly meeting notes in `/ingest` every Friday
2. Let AI extract project updates
3. Use heatmap to prioritize next week
4. Use CMD+K for daily status updates
5. Ask AI chat "What needs attention?" before standup meetings

Happy prioritizing! 🎯
