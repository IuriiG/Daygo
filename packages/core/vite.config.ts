import path from "node:path";
import { defineConfig } from 'vite'
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        outDir: path.resolve(__dirname, "./build/lib"),
        lib: {
            entry: path.resolve(__dirname, "./src/index.ts"),

            name: "DaygoCore",

            formats: ["es", "cjs"],

            fileName: (format, name) => `${name}.${format}.js`
        }
    },
    plugins: [dts()]
});
