import { test, expect } from '@playwright/test';

test.describe('TanStack DB App', () => {
  test('should load and display tasks from TanStack DB collection', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for the app to load
    await expect(page.locator('h1')).toContainText('TanStack DB Learning Journey');
    
    // Check that the success message appears
    await expect(page.locator('text=Step 1: Your first collection is working!')).toBeVisible();
    
    // Check that tasks are loaded
    await expect(page.locator('text=Tasks from TanStack DB Collection:')).toBeVisible();
    
    // Verify we have the expected tasks
    await expect(page.locator('li')).toHaveCount(3);
    
    // Check specific task content
    await expect(page.locator('text=Learn TanStack DB collections')).toBeVisible();
    await expect(page.locator('text=Try live queries')).toBeVisible();
    await expect(page.locator('text=Implement optimistic mutations')).toBeVisible();
    
    // Check that completed task has line-through style
    const completedTask = page.locator('text=Implement optimistic mutations').locator('..');
    await expect(completedTask).toHaveCSS('text-decoration', /line-through/);
    
    // Check the learning summary section
    await expect(page.locator('text=What you just learned:')).toBeVisible();
    await expect(page.locator('text=Created a TanStack DB client')).toBeVisible();
  });
  
  test('should capture browser state for AI analysis', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for loading to complete
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot for AI analysis
    await page.screenshot({ 
      path: 'browser-captures/ai-analysis-screenshot.png',
      fullPage: true 
    });
    
    // Extract data that would be useful for AI
    const appState = await page.evaluate(() => {
      const tasks = Array.from(document.querySelectorAll('li')).map(li => ({
        text: li.textContent?.trim(),
        completed: li.style.textDecoration === 'line-through',
        styles: li.getAttribute('style')
      }));
      
      return {
        title: document.title,
        url: window.location.href,
        tasksCount: tasks.length,
        tasks,
        hasLoadingState: document.querySelector('text=Loading') !== null,
        hasErrorState: document.querySelector('text=Error') !== null
      };
    });
    
    console.log('🤖 App State for AI Analysis:', JSON.stringify(appState, null, 2));
    
    // Verify the app is in the expected state
    expect(appState.tasksCount).toBe(3);
    expect(appState.title).toContain('Vite + React + TS');
  });
});
