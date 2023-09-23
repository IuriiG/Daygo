/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
    test: {
        name: 'DaygoCore',
        restoreMocks: true,
        globals: true
    }
});
