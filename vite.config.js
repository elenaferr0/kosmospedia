var _a, _b;
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
var repoName = (_b = (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split('/')[1]) !== null && _b !== void 0 ? _b : 'kosmospedia';
var base = process.env.GITHUB_ACTIONS ? "/".concat(repoName, "/") : '/';
export default defineConfig({
    base: base,
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
    },
});
