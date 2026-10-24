import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('🌱 Building MandiFlow production bundle...');
execSync('npm run build', { stdio: 'inherit' });

// Ensure 404.html exists for SPA routing
if (fs.existsSync('dist/index.html')) {
  fs.copyFileSync('dist/index.html', 'dist/404.html');
  console.log('✓ Created dist/404.html for GitHub Pages routing');
}

// Deploy to gh-pages branch
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mandiflow-deploy-'));
try {
  console.log('🚀 Deploying to gh-pages branch...');
  // Copy dist contents to temp dir
  fs.cpSync('dist', tempDir, { recursive: true });

  execSync('git init -b gh-pages', { cwd: tempDir, stdio: 'ignore' });
  execSync('git config user.name "dhanuu"', { cwd: tempDir, stdio: 'ignore' });
  execSync('git config user.email "shrustigowdaa@gmail.com"', { cwd: tempDir, stdio: 'ignore' });
  execSync('git add -A', { cwd: tempDir, stdio: 'ignore' });
  execSync('git commit -m "Deploy production bundle to gh-pages"', { cwd: tempDir, stdio: 'ignore' });
  execSync('git push origin gh-pages --force', { cwd: tempDir, stdio: 'inherit' });
  console.log('🎉 Successfully deployed to: https://dhanuugowdaa.github.io/mandiflow/');
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
