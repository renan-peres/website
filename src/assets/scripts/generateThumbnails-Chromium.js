import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs/promises';
import config from '../../../observablehq.config.js';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateThumbnails() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const baseUrl = 'http://localhost:3013'; // Observable default port
  const outputDir = path.join(process.cwd(), 'src', 'assets', 'thumbnails');

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Flatten navigation structure
  const pages = config.pages.flatMap(section => section.pages);

  for (const pageInfo of pages) {
    const url = `${baseUrl}${pageInfo.path}`;
    const filename = `${pageInfo.path.replace(/\//g, '-').slice(1)}.png`;
    const outputPath = path.join(outputDir, filename);

    try {
      // Navigate with longer timeout and no networkidle wait
      await page.goto(url, { 
        timeout: 60000,
        waitUntil: 'load'
      });

      // Wait for content to stabilize
      await delay(2000);

      await page.setViewportSize({ width: 1200, height: 630 });
      
      await page.screenshot({
        path: outputPath,
        type: 'png',
        fullPage: false
      });

      console.log(`✓ Generated thumbnail for ${pageInfo.path}`);
      
      // Add delay between screenshots
      await delay(1000);

    } catch (error) {
      console.error(`✗ Failed to generate thumbnail for ${pageInfo.path}:`, error.message);
    }
  }

  await browser.close();
}

generateThumbnails().catch(console.error);