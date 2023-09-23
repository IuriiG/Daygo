/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
    test: {
        name: 'DaygoReact',
        environment: 'happy-dom',
        restoreMocks: true,
        globals: true
    }
});
