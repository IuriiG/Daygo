/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
    test: {
        name: 'DaygoReact',
        environment: 'happy-dom',
        restoreMocks: true,
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/**/*.tsx', 'src/**/*.ts'],
        },
    }
});
