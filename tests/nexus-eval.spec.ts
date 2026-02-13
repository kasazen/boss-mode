import { test, expect } from '@playwright/test';
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

test.describe('CEO Strategic Nexus - Comprehensive Tests', () => {
  test.beforeEach(async () => {
    // Reset state before each test
    const statePath = path.join(process.cwd(), 'data', 'nexus_state.json');
    writeFileSync(
      statePath,
      JSON.stringify({
        version: '1.0',
        projects: [],
        conflicts: [],
        metadata: {
          totalFilesProcessed: 0,
          qualityScore: 100,
        },
      })
    );
  });

  test('should render heatmap with proper structure', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'CEO Strategic Nexus' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Priority Heatmap' })).toBeVisible();

    // Check that heatmap cells exist
    const cell = page.locator('[data-testid="heatmap-cell-5-5"]');
    await expect(cell).toBeVisible();
  });

  test('should display projects count and quality score', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/0 projects/)).toBeVisible();
    await expect(page.getByText(/Quality Score: 100/)).toBeVisible();
  });

  test('should ingest markdown file and extract projects', async ({ page }) => {
    const ingestPath = path.join(process.cwd(), 'ingest', 'test-project.md');
    writeFileSync(
      ingestPath,
      `# Project Phoenix

Our largest client is furious about the 3-week delay. They're threatening legal action if we don't ship by Friday.

Priority: Critical (9/10)
Urgency: Immediate (10/10)

Risks:
- Contract cancellation
- Legal liability
- Revenue loss of $2M

# Project Maintenance

Routine server updates scheduled for next month. Low priority, no urgency.

Priority: 2/10
Urgency: 1/10
`
    );

    await page.goto('/');
    await page.click('button:has-text("Ingest Files")');

    // Wait for ingestion to complete
    await page.waitForTimeout(5000);

    const statePath = path.join(process.cwd(), 'data', 'nexus_state.json');
    const state = JSON.parse(readFileSync(statePath, 'utf-8'));

    expect(state.projects.length).toBeGreaterThan(0);

    const phoenixProject = state.projects.find((p: any) => p.name.includes('Phoenix'));
    expect(phoenixProject).toBeDefined();
    expect(phoenixProject.stakeholderSentiment).toBe('furious');
    expect(phoenixProject.stakeholderUrgency).toBeGreaterThanOrEqual(8);
  });

  test('should render chat interface', async ({ page }) => {
    await page.goto('/');

    const chatInput = page.locator('[data-testid="chat-input"]');
    const chatSubmit = page.locator('[data-testid="chat-submit"]');

    await expect(chatInput).toBeVisible();
    await expect(chatSubmit).toBeVisible();
  });

  test('should show bivariate color scale in heatmap', async ({ page }) => {
    await page.goto('/');

    // Check that legend shows different color types
    await expect(page.getByText(/High Priority/)).toBeVisible();
    await expect(page.getByText(/High Urgency/)).toBeVisible();
    await expect(page.getByText(/Critical \(Both\)/)).toBeVisible();
  });

  test('should display critical zone with pulse effect', async ({ page }) => {
    // Create a project in the critical zone
    const statePath = path.join(process.cwd(), 'data', 'nexus_state.json');
    writeFileSync(
      statePath,
      JSON.stringify({
        version: '1.0',
        projects: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Critical Project',
            description: 'Test project',
            ceoPriority: 9,
            stakeholderUrgency: 9,
            stakeholderSentiment: 'furious',
            status: 'active',
            notes: 'Test notes',
            keyRisks: ['Risk 1'],
            dependencies: [],
            history: [
              {
                timestamp: new Date().toISOString(),
                change: 'Created',
                captureMethod: 'file',
              },
            ],
            lastUpdated: new Date().toISOString(),
          },
        ],
        conflicts: [],
        metadata: {
          totalFilesProcessed: 1,
          qualityScore: 100,
        },
      })
    );

    await page.goto('/');

    const criticalCell = page.locator('[data-testid="heatmap-cell-9-9"]');
    await expect(criticalCell).toHaveClass(/critical-cell/);
  });
});
