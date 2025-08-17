#!/usr/bin/env tsx

import { chromium, webkit, firefox } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface TaskElement {
  text: string | null;
  style: string | null;
  completed: boolean;
}

interface BrowserCapture {
  timestamp: string;
  url: string;
  title: string;
  screenshot: string;
  html: string;
  console: string[];
  tasks: TaskElement[];  // DOM-extracted task elements
  performance: {
    loadTime: number;
    domReady: number;
  };
}

async function captureBrowserState(browserType: 'webkit' | 'chromium' | 'firefox' = 'webkit') {
  console.log(`🚀 Starting browser capture with ${browserType}...`);
  
  // Ensure output directory exists
  const outputDir = join(process.cwd(), 'browser-captures');
  mkdirSync(outputDir, { recursive: true });
  
  const browserEngine = browserType === 'webkit' ? webkit : 
                       browserType === 'firefox' ? firefox : chromium;
                       
  const browser = await browserEngine.launch({ headless: false });
  
  // Create context with HTTPS error ignoring
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  const consoleLogs: string[] = [];
  
  // Capture console logs
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  try {
    // Navigate to your app
    console.log('📱 Navigating to your TanStack DB app...');
    await page.goto('https://localhost:3000');
    
    // Wait for the app to load
    await page.waitForSelector('h1', { timeout: 10000 });
    
    // Wait a bit more for data to load
    await page.waitForTimeout(2000);
    
    // Capture screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = join(outputDir, `screenshot-${timestamp}.png`);
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    
    // Extract page data
    const pageData = await page.evaluate(() => {
      // Get all task elements
      const taskElements = Array.from(document.querySelectorAll('li'));
      const tasks = taskElements.map(el => ({
        text: el.textContent?.trim(),
        style: el.getAttribute('style'),
        completed: el.style.textDecoration === 'line-through'
      }));
      
      // Get performance data using modern API
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const performanceData = {
        loadTime: Math.round(navEntry?.loadEventEnd || 0),
        domReady: Math.round(navEntry?.domContentLoadedEventEnd || 0)
      };
      
      return {
        title: document.title,
        url: window.location.href,
        html: document.documentElement.outerHTML,
        tasks,
        performance: performanceData
      };
    });
    
    const capture: BrowserCapture = {
      timestamp: new Date().toISOString(),
      url: pageData.url,
      title: pageData.title,
      screenshot: screenshotPath,
      html: pageData.html,
      console: consoleLogs,
      tasks: pageData.tasks,
      performance: pageData.performance
    };
    
    // Save capture data
    const captureFile = join(outputDir, `capture-${timestamp}.json`);
    writeFileSync(captureFile, JSON.stringify(capture, null, 2));
    
    console.log('✅ Browser state captured successfully!');
    console.log(`📸 Screenshot: ${screenshotPath}`);
    console.log(`📄 Data: ${captureFile}`);
    console.log(`📋 Found ${capture.tasks.length} tasks`);
    console.log(`🚀 Page loaded in ${capture.performance.loadTime}ms`);
    
    // Print summary for AI assistant
    console.log('\n🤖 AI Assistant Summary:');
    console.log('========================');
    console.log(`Page Title: ${capture.title}`);
    console.log(`Tasks Found: ${capture.tasks.length}`);
    capture.tasks.forEach((task, i) => {
      console.log(`  ${i + 1}. ${task.text} ${task.completed ? '✅' : '⏳'}`);
    });
    console.log(`Console Logs: ${capture.console.length} messages`);
    capture.console.forEach(log => console.log(`  ${log}`));
    
    return capture;
    
  } catch (error) {
    console.error('❌ Error capturing browser state:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// CLI usage - ES module way to check if this is the main module
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const browserType = process.argv[2] as 'webkit' | 'chromium' | 'firefox' || 'webkit';
  captureBrowserState(browserType)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { captureBrowserState };
