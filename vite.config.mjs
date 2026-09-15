import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build'
    },
    server: {
        fs: {
            // Backend configuration and stored tokens must never be served.
            allow: ['src', 'public', 'node_modules'],
            deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/*.env*', '**/api/**', '**/bankaccounts/**', '**/testdata/**', '**/*.log']
        }
    }
});
