import path from "node:path";
import { defineConfig } from 'vite';
import dts from "vite-plugin-dts";

const globals = {
    'react': 'React',
    'react-dom': 'ReactDOM',
    '@daygo/core': 'DaygoCore',
    'use-sync-external-store/shim': 'UseSyncExternalStore'
};

const external = (moduleName: string) => Object.keys(globals).includes(moduleName);


export default defineConfig({
    build: {
        outDir: path.resolve(__dirname, "./build/lib"),
        lib: {
            entry: path.resolve(__dirname, "./src/index.ts"),

            name: "DaygoReact",

            formats: ["es", "cjs"],
            
            fileName: (format, name) => `${name}.${format}.js`
        },
        rollupOptions: {
            external,
            output: { globals }
        }
    },
    plugins: [dts({
        pathsToAliases: false,
        exclude: ["src/**/*.test.ts"]
    })]
});
