import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Helper plugin to copy manifest.json and pdf.worker to dist, and bundle content script
function copyExtensionAssetsPlugin() {
  return {
    name: 'copy-extension-assets',
    async closeBundle() {
      if (!existsSync('dist')) {
        mkdirSync('dist', { recursive: true });
      }
      // Copy Chrome Extension manifest
      if (existsSync('public/manifest.json')) {
        copyFileSync('public/manifest.json', 'dist/manifest.json');
      }
      // Copy PDF.js worker locally so it works under extension CSP (no CDN needed)
      const workerSrc = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.js');
      if (existsSync(workerSrc)) {
        copyFileSync(workerSrc, 'dist/pdf.worker.min.js');
      }

      // Compile content.ts as a single self-contained iife bundle so it does not contain import statements
      try {
        const esbuild = await import('esbuild');
        await esbuild.build({
          entryPoints: [path.resolve(__dirname, 'src/content/index.ts')],
          outfile: path.resolve(__dirname, 'dist/content.js'),
          bundle: true,
          minify: true,
          target: 'es2020',
          format: 'iife',
        });
        console.log('Successfully bundled content script as a self-contained IIFE.');
      } catch (err) {
        console.error('Failed to bundle content script with esbuild:', err);
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyExtensionAssetsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        popup: path.resolve(__dirname, 'popup.html'),
        sidepanel: path.resolve(__dirname, 'sidepanel.html'),
        background: path.resolve(__dirname, 'src/background/index.ts'),
        content: path.resolve(__dirname, 'src/content/index.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') return 'background.js';
          if (chunkInfo.name === 'content') return 'content.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
